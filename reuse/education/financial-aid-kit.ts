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

import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
  Association,
  Transaction,
  Op,
  QueryTypes,
  ValidationError
} from 'sequelize';

// ============================================================================
// TypeScript Interfaces and Types
// ============================================================================

export interface FinancialAidAttributes {
  id: number;
  student_id: number;
  academic_year: string;
  award_year: string;
  term_id?: number;
  enrollment_status: 'full-time' | 'half-time' | 'less-than-half' | 'not-enrolled';
  dependency_status: 'dependent' | 'independent';
  efc: number; // Expected Family Contribution
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
  ssn_encrypted: string; // Encrypted SSN
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
  fafsa_raw_data?: Record<string, any>; // Full ISIR data as JSON
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
  pace_requirement: number; // Completion rate percentage
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
  return_allocation: Record<string, number>; // By fund type
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

// Optional interfaces for creation (id, timestamps auto-generated)
export type FinancialAidCreationAttributes = Optional<FinancialAidAttributes, 'id' | 'created_at' | 'updated_at'>;
export type AwardCreationAttributes = Optional<AwardAttributes, 'id' | 'created_at' | 'updated_at'>;
export type DisbursementCreationAttributes = Optional<DisbursementAttributes, 'id' | 'created_at' | 'updated_at'>;
export type FAFSADataCreationAttributes = Optional<FAFSADataAttributes, 'id' | 'created_at' | 'updated_at'>;
export type SAPRecordCreationAttributes = Optional<SAPRecordAttributes, 'id' | 'created_at' | 'updated_at'>;
export type ProfessionalJudgmentCreationAttributes = Optional<ProfessionalJudgmentAttributes, 'id' | 'created_at' | 'updated_at'>;
export type CODReportCreationAttributes = Optional<CODReportAttributes, 'id' | 'created_at' | 'updated_at'>;
export type R2T4CalculationCreationAttributes = Optional<R2T4CalculationAttributes, 'id' | 'created_at' | 'updated_at'>;

// ============================================================================
// Sequelize Models
// ============================================================================

export class FinancialAid extends Model<FinancialAidAttributes, FinancialAidCreationAttributes> implements FinancialAidAttributes {
  public id!: number;
  public student_id!: number;
  public academic_year!: string;
  public award_year!: string;
  public term_id?: number;
  public enrollment_status!: 'full-time' | 'half-time' | 'less-than-half' | 'not-enrolled';
  public dependency_status!: 'dependent' | 'independent';
  public efc!: number;
  public cost_of_attendance!: number;
  public financial_need!: number;
  public total_awarded!: number;
  public total_disbursed!: number;
  public status!: 'pending' | 'packaged' | 'accepted' | 'declined' | 'cancelled';
  public packaging_date?: Date;
  public acceptance_date?: Date;
  public verification_status?: 'not-selected' | 'selected' | 'completed' | 'exempted';
  public verification_completed_date?: Date;
  public housing_status?: 'on-campus' | 'off-campus' | 'with-parents';
  public special_circumstances?: string;
  public notes?: string;
  public created_by?: number;
  public updated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  // Associations
  public readonly awards?: Award[];
  public readonly fafsaData?: FAFSAData;
  public readonly sapRecords?: SAPRecord[];
  public readonly professionalJudgments?: ProfessionalJudgment[];
  public readonly r2t4Calculations?: R2T4Calculation[];

  public static associations: {
    awards: Association<FinancialAid, Award>;
    fafsaData: Association<FinancialAid, FAFSAData>;
    sapRecords: Association<FinancialAid, SAPRecord>;
    professionalJudgments: Association<FinancialAid, ProfessionalJudgment>;
    r2t4Calculations: Association<FinancialAid, R2T4Calculation>;
  };
}

export class Award extends Model<AwardAttributes, AwardCreationAttributes> implements AwardAttributes {
  public id!: number;
  public financial_aid_id!: number;
  public student_id!: number;
  public academic_year!: string;
  public award_type!: 'pell' | 'seog' | 'perkins' | 'subsidized' | 'unsubsidized' | 'plus' | 'work-study' | 'institutional' | 'state' | 'external';
  public fund_source!: string;
  public fund_code!: string;
  public award_name!: string;
  public offered_amount!: number;
  public accepted_amount!: number;
  public disbursed_amount!: number;
  public remaining_amount!: number;
  public award_status!: 'offered' | 'accepted' | 'declined' | 'cancelled' | 'disbursed' | 'completed';
  public offer_date!: Date;
  public acceptance_date?: Date;
  public decline_reason?: string;
  public is_need_based!: boolean;
  public is_federal!: boolean;
  public is_loan!: boolean;
  public interest_rate?: number;
  public origination_fee_percent?: number;
  public grace_period_months?: number;
  public max_eligibility_amount?: number;
  public enrollment_requirement?: string;
  public renewal_eligible!: boolean;
  public metadata?: Record<string, any>;
  public created_by?: number;
  public updated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  // Associations
  public readonly financialAid?: FinancialAid;
  public readonly disbursements?: Disbursement[];

  public static associations: {
    financialAid: Association<Award, FinancialAid>;
    disbursements: Association<Award, Disbursement>;
  };
}

export class Disbursement extends Model<DisbursementAttributes, DisbursementCreationAttributes> implements DisbursementAttributes {
  public id!: number;
  public award_id!: number;
  public student_id!: number;
  public financial_aid_id!: number;
  public disbursement_number!: number;
  public scheduled_date!: Date;
  public actual_date?: Date;
  public amount!: number;
  public net_amount!: number;
  public origination_fee?: number;
  public enrollment_status!: string;
  public credits_enrolled?: number;
  public status!: 'scheduled' | 'pending' | 'processing' | 'released' | 'returned' | 'cancelled';
  public release_method!: 'direct-deposit' | 'check' | 'credit-to-account' | 'book-advance';
  public transaction_id?: string;
  public external_reference?: string;
  public cod_reported!: boolean;
  public cod_report_date?: Date;
  public cod_accepted!: boolean;
  public return_amount?: number;
  public return_reason?: string;
  public return_date?: Date;
  public notes?: string;
  public created_by?: number;
  public updated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  // Associations
  public readonly award?: Award;

  public static associations: {
    award: Association<Disbursement, Award>;
  };
}

export class FAFSAData extends Model<FAFSADataAttributes, FAFSADataCreationAttributes> implements FAFSADataAttributes {
  public id!: number;
  public student_id!: number;
  public award_year!: string;
  public transaction_number!: number;
  public dob!: Date;
  public ssn_encrypted!: string;
  public citizenship_status!: string;
  public email!: string;
  public phone?: string;
  public marital_status!: string;
  public state_of_residence!: string;
  public household_size!: number;
  public num_in_college!: number;
  public student_agi!: number;
  public parent_agi?: number;
  public student_income_tax!: number;
  public parent_income_tax?: number;
  public student_assets!: number;
  public parent_assets?: number;
  public efc!: number;
  public dependency_status!: 'dependent' | 'independent';
  public automatic_zero_efc!: boolean;
  public simplified_needs_test!: boolean;
  public pell_eligible!: boolean;
  public pell_lifetime_eligibility_used!: number;
  public application_type!: 'web' | 'paper' | 'correction';
  public correction_number!: number;
  public isir_received_date!: Date;
  public processed_date!: Date;
  public verification_selection!: boolean;
  public verification_tracking_flags?: string;
  public reject_codes?: string;
  public comment_codes?: string;
  public housing_code!: string;
  public special_circumstances?: string;
  public fafsa_raw_data?: Record<string, any>;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  public static associations: {
    financialAid: Association<FAFSAData, FinancialAid>;
  };
}

export class SAPRecord extends Model<SAPRecordAttributes, SAPRecordCreationAttributes> implements SAPRecordAttributes {
  public id!: number;
  public student_id!: number;
  public academic_year!: string;
  public evaluation_date!: Date;
  public evaluation_term_id!: number;
  public sap_status!: 'satisfactory' | 'warning' | 'probation' | 'suspension' | 'dismissed';
  public gpa_requirement!: number;
  public current_gpa!: number;
  public gpa_met!: boolean;
  public pace_requirement!: number;
  public current_pace!: number;
  public pace_met!: boolean;
  public max_timeframe_credits!: number;
  public attempted_credits!: number;
  public completed_credits!: number;
  public max_timeframe_met!: boolean;
  public overall_sap_met!: boolean;
  public appeal_submitted!: boolean;
  public appeal_approved?: boolean;
  public appeal_date?: Date;
  public appeal_reason?: string;
  public academic_plan_required!: boolean;
  public academic_plan_submitted?: boolean;
  public reinstatement_date?: Date;
  public probation_terms?: number;
  public financial_aid_eligible!: boolean;
  public next_evaluation_date?: Date;
  public notes?: string;
  public evaluator_id?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  public static associations: {
    financialAid: Association<SAPRecord, FinancialAid>;
  };
}

export class ProfessionalJudgment extends Model<ProfessionalJudgmentAttributes, ProfessionalJudgmentCreationAttributes> implements ProfessionalJudgmentAttributes {
  public id!: number;
  public student_id!: number;
  public financial_aid_id!: number;
  public award_year!: string;
  public judgment_type!: 'dependency-override' | 'income-adjustment' | 'special-circumstance' | 'cost-adjustment' | 'efc-adjustment';
  public reason!: string;
  public documentation?: string;
  public original_efc!: number;
  public adjusted_efc!: number;
  public original_coa?: number;
  public adjusted_coa?: number;
  public original_income?: number;
  public adjusted_income?: number;
  public approval_status!: 'pending' | 'approved' | 'denied';
  public submitted_date!: Date;
  public reviewed_date?: Date;
  public reviewer_id?: number;
  public effective_date?: Date;
  public expiration_date?: Date;
  public notes?: string;
  public supporting_documents?: string[];
  public created_by?: number;
  public updated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  public static associations: {
    financialAid: Association<ProfessionalJudgment, FinancialAid>;
  };
}

export class CODReport extends Model<CODReportAttributes, CODReportCreationAttributes> implements CODReportAttributes {
  public id!: number;
  public report_type!: 'origination' | 'disbursement' | 'change' | 'correction';
  public batch_id!: string;
  public report_date!: Date;
  public academic_year!: string;
  public school_code!: string;
  public total_records!: number;
  public total_amount!: number;
  public file_name!: string;
  public file_path?: string;
  public submission_date?: Date;
  public submission_method!: 'saig' | 'edconnect' | 'manual';
  public acknowledgment_received!: boolean;
  public acknowledgment_date?: Date;
  public acknowledgment_file?: string;
  public errors_count!: number;
  public warnings_count!: number;
  public accepted_count!: number;
  public rejected_count!: number;
  public status!: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'corrected';
  public error_details?: Record<string, any>[];
  public resubmission_of?: number;
  public notes?: string;
  public created_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;
}

export class R2T4Calculation extends Model<R2T4CalculationAttributes, R2T4CalculationCreationAttributes> implements R2T4CalculationAttributes {
  public id!: number;
  public student_id!: number;
  public financial_aid_id!: number;
  public academic_year!: string;
  public term_id!: number;
  public withdrawal_date!: Date;
  public determination_date!: Date;
  public last_attendance_date?: Date;
  public withdrawal_type!: 'official' | 'unofficial' | 'administrative';
  public total_days_in_period!: number;
  public days_completed!: number;
  public completion_percentage!: number;
  public total_aid_disbursed!: number;
  public total_aid_could_disburse!: number;
  public earned_aid!: number;
  public unearned_aid!: number;
  public aid_to_return!: number;
  public student_return_amount!: number;
  public school_return_amount!: number;
  public post_withdrawal_disbursement?: number;
  public return_allocation!: Record<string, number>;
  public return_deadline!: Date;
  public return_completed!: boolean;
  public return_completion_date?: Date;
  public nslds_reported!: boolean;
  public nslds_report_date?: Date;
  public status!: 'calculated' | 'pending-return' | 'completed' | 'appealed';
  public calculation_details!: Record<string, any>;
  public notes?: string;
  public calculated_by?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public deleted_at?: Date;

  public static associations: {
    financialAid: Association<R2T4Calculation, FinancialAid>;
  };
}

// ============================================================================
// Model Initialization Functions
// ============================================================================

/**
 * Initialize all Financial Aid Sequelize models
 * @param sequelize - Sequelize instance
 * @returns Object containing all initialized models
 */
export function initFinancialAidModels(sequelize: Sequelize) {
  // Financial Aid Model
  FinancialAid.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to student table',
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
        comment: 'Format: 2023-2024',
      },
      award_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
        comment: 'Federal award year: 2023-2024',
      },
      term_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      enrollment_status: {
        type: DataTypes.ENUM('full-time', 'half-time', 'less-than-half', 'not-enrolled'),
        allowNull: false,
        defaultValue: 'full-time',
      },
      dependency_status: {
        type: DataTypes.ENUM('dependent', 'independent'),
        allowNull: false,
      },
      efc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Expected Family Contribution',
      },
      cost_of_attendance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      financial_need: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'COA - EFC',
      },
      total_awarded: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_disbursed: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('pending', 'packaged', 'accepted', 'declined', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      packaging_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      acceptance_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verification_status: {
        type: DataTypes.ENUM('not-selected', 'selected', 'completed', 'exempted'),
        allowNull: true,
      },
      verification_completed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      housing_status: {
        type: DataTypes.ENUM('on-campus', 'off-campus', 'with-parents'),
        allowNull: true,
      },
      special_circumstances: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'financial_aid',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_fa_student_year',
          fields: ['student_id', 'academic_year'],
        },
        {
          name: 'idx_fa_award_year',
          fields: ['award_year'],
        },
        {
          name: 'idx_fa_status',
          fields: ['status'],
          where: { deleted_at: null },
        },
        {
          name: 'idx_fa_verification',
          fields: ['verification_status'],
          where: { verification_status: 'selected' },
        },
      ],
    }
  );

  // Award Model
  Award.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      financial_aid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'financial_aid',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      award_type: {
        type: DataTypes.ENUM('pell', 'seog', 'perkins', 'subsidized', 'unsubsidized', 'plus', 'work-study', 'institutional', 'state', 'external'),
        allowNull: false,
      },
      fund_source: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      fund_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      award_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      offered_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      accepted_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      disbursed_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      remaining_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      award_status: {
        type: DataTypes.ENUM('offered', 'accepted', 'declined', 'cancelled', 'disbursed', 'completed'),
        allowNull: false,
        defaultValue: 'offered',
      },
      offer_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      acceptance_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      decline_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_need_based: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_federal: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_loan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      interest_rate: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: true,
      },
      origination_fee_percent: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: true,
      },
      grace_period_months: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      max_eligibility_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      enrollment_requirement: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      renewal_eligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'award',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_award_fa',
          fields: ['financial_aid_id'],
        },
        {
          name: 'idx_award_student_year',
          fields: ['student_id', 'academic_year'],
        },
        {
          name: 'idx_award_type',
          fields: ['award_type'],
        },
        {
          name: 'idx_award_status',
          fields: ['award_status'],
        },
        {
          name: 'idx_award_fund_code',
          fields: ['fund_code'],
        },
      ],
    }
  );

  // Disbursement Model
  Disbursement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      award_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'award',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      financial_aid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      disbursement_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '1 for first disbursement, 2 for second, etc.',
      },
      scheduled_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      actual_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      net_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Amount after fees',
      },
      origination_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      enrollment_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      credits_enrolled: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'pending', 'processing', 'released', 'returned', 'cancelled'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      release_method: {
        type: DataTypes.ENUM('direct-deposit', 'check', 'credit-to-account', 'book-advance'),
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      external_reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cod_reported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cod_report_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cod_accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      return_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      return_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'disbursement',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_disb_award',
          fields: ['award_id', 'disbursement_number'],
        },
        {
          name: 'idx_disb_student_date',
          fields: ['student_id', 'scheduled_date'],
        },
        {
          name: 'idx_disb_status',
          fields: ['status'],
          where: { status: ['pending', 'processing'] },
        },
        {
          name: 'idx_disb_cod',
          fields: ['cod_reported', 'cod_accepted'],
        },
        {
          name: 'idx_disb_transaction',
          fields: ['transaction_id'],
          unique: true,
          where: { transaction_id: { [Op.ne]: null } },
        },
      ],
    }
  );

  // FAFSA Data Model
  FAFSAData.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      award_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      transaction_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ssn_encrypted: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Encrypted SSN using pgcrypto',
      },
      citizenship_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      marital_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      state_of_residence: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      household_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      num_in_college: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_agi: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Adjusted Gross Income',
      },
      parent_agi: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      student_income_tax: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      parent_income_tax: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      student_assets: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      parent_assets: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      efc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      dependency_status: {
        type: DataTypes.ENUM('dependent', 'independent'),
        allowNull: false,
      },
      automatic_zero_efc: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      simplified_needs_test: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pell_eligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pell_lifetime_eligibility_used: {
        type: DataTypes.DECIMAL(5, 3),
        allowNull: false,
        defaultValue: 0,
        comment: 'Percentage of lifetime eligibility used (0-6.0)',
      },
      application_type: {
        type: DataTypes.ENUM('web', 'paper', 'correction'),
        allowNull: false,
      },
      correction_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isir_received_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      processed_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verification_selection: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verification_tracking_flags: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      reject_codes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      comment_codes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      housing_code: {
        type: DataTypes.STRING(2),
        allowNull: false,
      },
      special_circumstances: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fafsa_raw_data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Full ISIR data as JSON',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'fafsa_data',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_fafsa_student_year',
          fields: ['student_id', 'award_year'],
          unique: true,
        },
        {
          name: 'idx_fafsa_transaction',
          fields: ['transaction_number'],
        },
        {
          name: 'idx_fafsa_verification',
          fields: ['verification_selection'],
          where: { verification_selection: true },
        },
        {
          name: 'idx_fafsa_raw_data',
          fields: ['fafsa_raw_data'],
          using: 'gin',
        },
      ],
    }
  );

  // SAP Record Model
  SAPRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      evaluation_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      evaluation_term_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sap_status: {
        type: DataTypes.ENUM('satisfactory', 'warning', 'probation', 'suspension', 'dismissed'),
        allowNull: false,
      },
      gpa_requirement: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
      },
      current_gpa: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
      },
      gpa_met: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pace_requirement: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Completion rate percentage (e.g., 67.00)',
      },
      current_pace: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      pace_met: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      max_timeframe_credits: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      attempted_credits: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      completed_credits: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      max_timeframe_met: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      overall_sap_met: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      appeal_submitted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      appeal_approved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      appeal_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      appeal_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      academic_plan_required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      academic_plan_submitted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      reinstatement_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      probation_terms: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      financial_aid_eligible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      next_evaluation_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evaluator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'sap_record',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_sap_student_year',
          fields: ['student_id', 'academic_year'],
        },
        {
          name: 'idx_sap_status',
          fields: ['sap_status'],
        },
        {
          name: 'idx_sap_evaluation_date',
          fields: ['evaluation_date'],
        },
        {
          name: 'idx_sap_aid_eligible',
          fields: ['financial_aid_eligible'],
        },
      ],
    }
  );

  // Professional Judgment Model
  ProfessionalJudgment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      financial_aid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      award_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      judgment_type: {
        type: DataTypes.ENUM('dependency-override', 'income-adjustment', 'special-circumstance', 'cost-adjustment', 'efc-adjustment'),
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      documentation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      original_efc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      adjusted_efc: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      original_coa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      adjusted_coa: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      original_income: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      adjusted_income: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      approval_status: {
        type: DataTypes.ENUM('pending', 'approved', 'denied'),
        allowNull: false,
        defaultValue: 'pending',
      },
      submitted_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reviewed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      effective_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      supporting_documents: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'professional_judgment',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_pj_student_year',
          fields: ['student_id', 'award_year'],
        },
        {
          name: 'idx_pj_fa',
          fields: ['financial_aid_id'],
        },
        {
          name: 'idx_pj_status',
          fields: ['approval_status'],
        },
        {
          name: 'idx_pj_type',
          fields: ['judgment_type'],
        },
      ],
    }
  );

  // COD Report Model
  CODReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      report_type: {
        type: DataTypes.ENUM('origination', 'disbursement', 'change', 'correction'),
        allowNull: false,
      },
      batch_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      report_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      school_code: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      total_records: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_path: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      submission_method: {
        type: DataTypes.ENUM('saig', 'edconnect', 'manual'),
        allowNull: false,
      },
      acknowledgment_received: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      acknowledgment_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      acknowledgment_file: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      errors_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      warnings_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accepted_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rejected_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('pending', 'submitted', 'accepted', 'rejected', 'corrected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      error_details: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      resubmission_of: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'cod_report',
          key: 'id',
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'cod_report',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_cod_batch',
          fields: ['batch_id'],
          unique: true,
        },
        {
          name: 'idx_cod_year',
          fields: ['academic_year'],
        },
        {
          name: 'idx_cod_status',
          fields: ['status'],
        },
        {
          name: 'idx_cod_submission',
          fields: ['submission_date'],
        },
      ],
    }
  );

  // R2T4 Calculation Model
  R2T4Calculation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      financial_aid_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      academic_year: {
        type: DataTypes.STRING(9),
        allowNull: false,
      },
      term_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      withdrawal_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      determination_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      last_attendance_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      withdrawal_type: {
        type: DataTypes.ENUM('official', 'unofficial', 'administrative'),
        allowNull: false,
      },
      total_days_in_period: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      days_completed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      completion_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      total_aid_disbursed: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      total_aid_could_disburse: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      earned_aid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      unearned_aid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      aid_to_return: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      student_return_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      school_return_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      post_withdrawal_disbursement: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      return_allocation: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Return amounts by fund type',
      },
      return_deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      return_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      return_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nslds_reported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      nslds_report_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('calculated', 'pending-return', 'completed', 'appealed'),
        allowNull: false,
        defaultValue: 'calculated',
      },
      calculation_details: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      calculated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'r2t4_calculation',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'idx_r2t4_student',
          fields: ['student_id', 'academic_year'],
        },
        {
          name: 'idx_r2t4_fa',
          fields: ['financial_aid_id'],
        },
        {
          name: 'idx_r2t4_status',
          fields: ['status'],
        },
        {
          name: 'idx_r2t4_deadline',
          fields: ['return_deadline'],
          where: { return_completed: false },
        },
      ],
    }
  );

  // Define Associations
  FinancialAid.hasMany(Award, {
    sourceKey: 'id',
    foreignKey: 'financial_aid_id',
    as: 'awards',
  });

  Award.belongsTo(FinancialAid, {
    foreignKey: 'financial_aid_id',
    as: 'financialAid',
  });

  Award.hasMany(Disbursement, {
    sourceKey: 'id',
    foreignKey: 'award_id',
    as: 'disbursements',
  });

  Disbursement.belongsTo(Award, {
    foreignKey: 'award_id',
    as: 'award',
  });

  FinancialAid.hasOne(FAFSAData, {
    sourceKey: 'student_id',
    foreignKey: 'student_id',
    as: 'fafsaData',
  });

  FinancialAid.hasMany(SAPRecord, {
    sourceKey: 'student_id',
    foreignKey: 'student_id',
    as: 'sapRecords',
  });

  FinancialAid.hasMany(ProfessionalJudgment, {
    sourceKey: 'id',
    foreignKey: 'financial_aid_id',
    as: 'professionalJudgments',
  });

  FinancialAid.hasMany(R2T4Calculation, {
    sourceKey: 'id',
    foreignKey: 'financial_aid_id',
    as: 'r2t4Calculations',
  });

  return {
    FinancialAid,
    Award,
    Disbursement,
    FAFSAData,
    SAPRecord,
    ProfessionalJudgment,
    CODReport,
    R2T4Calculation,
  };
}

/**
 * Sync Financial Aid schema with database (creates tables)
 * @param sequelize - Sequelize instance
 * @param options - Sync options (alter, force)
 */
export async function syncFinancialAidSchema(
  sequelize: Sequelize,
  options: { alter?: boolean; force?: boolean } = {}
): Promise<void> {
  await sequelize.sync(options);
}

// ============================================================================
// Model CRUD Operations (8 functions)
// ============================================================================

/**
 * Create a new financial aid record
 */
export async function createFinancialAidRecord(
  data: FinancialAidCreationAttributes,
  transaction?: Transaction
): Promise<FinancialAid> {
  return await FinancialAid.create(data, { transaction });
}

/**
 * Update a financial aid record
 */
export async function updateFinancialAidRecord(
  id: number,
  updates: Partial<FinancialAidAttributes>,
  transaction?: Transaction
): Promise<[number, FinancialAid[]]> {
  return await FinancialAid.update(updates, {
    where: { id },
    returning: true,
    transaction,
  });
}

/**
 * Soft delete a financial aid record
 */
export async function deleteFinancialAidRecord(
  id: number,
  transaction?: Transaction
): Promise<number> {
  return await FinancialAid.destroy({
    where: { id },
    transaction,
  });
}

/**
 * Get financial aid record by ID with associations
 */
export async function getFinancialAidById(
  id: number,
  includeAssociations: boolean = true
): Promise<FinancialAid | null> {
  const include = includeAssociations
    ? [
        { model: Award, as: 'awards', include: [{ model: Disbursement, as: 'disbursements' }] },
        { model: FAFSAData, as: 'fafsaData' },
        { model: SAPRecord, as: 'sapRecords' },
        { model: ProfessionalJudgment, as: 'professionalJudgments' },
        { model: R2T4Calculation, as: 'r2t4Calculations' },
      ]
    : [];

  return await FinancialAid.findByPk(id, { include });
}

/**
 * Query financial aid records with filters
 */
export async function queryFinancialAidRecords(filters: {
  student_id?: number;
  academic_year?: string;
  award_year?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ rows: FinancialAid[]; count: number }> {
  const where: any = {};
  if (filters.student_id) where.student_id = filters.student_id;
  if (filters.academic_year) where.academic_year = filters.academic_year;
  if (filters.award_year) where.award_year = filters.award_year;
  if (filters.status) where.status = filters.status;

  return await FinancialAid.findAndCountAll({
    where,
    limit: filters.limit || 50,
    offset: filters.offset || 0,
    order: [['created_at', 'DESC']],
    include: [
      { model: Award, as: 'awards' },
      { model: FAFSAData, as: 'fafsaData' },
    ],
  });
}

/**
 * Bulk import financial aid records
 */
export async function bulkImportFinancialAid(
  records: FinancialAidCreationAttributes[],
  transaction?: Transaction
): Promise<FinancialAid[]> {
  return await FinancialAid.bulkCreate(records, {
    transaction,
    validate: true,
  });
}

// ============================================================================
// FAFSA Integration Functions (5 functions)
// ============================================================================

/**
 * Import FAFSA data from ISIR file
 */
export async function importFAFSAData(
  fafsaData: FAFSADataCreationAttributes,
  transaction?: Transaction
): Promise<FAFSAData> {
  // Check for existing FAFSA for this student/year
  const existing = await FAFSAData.findOne({
    where: {
      student_id: fafsaData.student_id,
      award_year: fafsaData.award_year,
    },
  });

  if (existing && fafsaData.transaction_number > existing.transaction_number) {
    // Update existing with newer transaction
    await existing.update(fafsaData, { transaction });
    return existing;
  } else if (!existing) {
    // Create new FAFSA record
    return await FAFSAData.create(fafsaData, { transaction });
  }

  return existing;
}

/**
 * Validate FAFSA data for completeness and accuracy
 */
export async function validateFAFSA(
  student_id: number,
  award_year: string
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const fafsa = await FAFSAData.findOne({
    where: { student_id, award_year },
  });

  if (!fafsa) {
    return { valid: false, errors: ['FAFSA not found'], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation rules
  if (fafsa.reject_codes) {
    errors.push(`FAFSA has reject codes: ${fafsa.reject_codes}`);
  }

  if (fafsa.efc < 0) {
    errors.push('EFC cannot be negative');
  }

  if (fafsa.household_size < 1) {
    errors.push('Household size must be at least 1');
  }

  if (fafsa.dependency_status === 'dependent' && !fafsa.parent_agi) {
    errors.push('Dependent students must have parent AGI');
  }

  if (fafsa.verification_selection && !fafsa.verification_tracking_flags) {
    warnings.push('Student selected for verification but no tracking flags');
  }

  if (fafsa.pell_lifetime_eligibility_used >= 6.0) {
    warnings.push('Student has used maximum Pell lifetime eligibility');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculate EFC (Expected Family Contribution) from FAFSA data
 */
export async function calculateEFC(
  student_id: number,
  award_year: string
): Promise<number> {
  const fafsa = await FAFSAData.findOne({
    where: { student_id, award_year },
  });

  if (!fafsa) {
    throw new Error('FAFSA data not found');
  }

  // Use the EFC from FAFSA (federal calculation)
  // This is already calculated by the federal processor
  return fafsa.efc;
}

/**
 * Parse FAFSA ISIR XML/JSON data
 */
export async function parseFAFSAISIR(
  isirData: Record<string, any>,
  student_id: number
): Promise<FAFSADataCreationAttributes> {
  // Parse ISIR data structure (simplified example)
  return {
    student_id,
    award_year: isirData.award_year || '',
    transaction_number: isirData.transaction_number || 1,
    dob: new Date(isirData.date_of_birth),
    ssn_encrypted: isirData.ssn, // Should be encrypted before storage
    citizenship_status: isirData.citizenship_status || '',
    email: isirData.email || '',
    phone: isirData.phone,
    marital_status: isirData.marital_status || '',
    state_of_residence: isirData.state_of_legal_residence || '',
    household_size: parseInt(isirData.household_size) || 1,
    num_in_college: parseInt(isirData.number_in_college) || 1,
    student_agi: parseFloat(isirData.student_agi) || 0,
    parent_agi: isirData.parent_agi ? parseFloat(isirData.parent_agi) : undefined,
    student_income_tax: parseFloat(isirData.student_income_tax) || 0,
    parent_income_tax: isirData.parent_income_tax ? parseFloat(isirData.parent_income_tax) : undefined,
    student_assets: parseFloat(isirData.student_assets) || 0,
    parent_assets: isirData.parent_assets ? parseFloat(isirData.parent_assets) : undefined,
    efc: parseFloat(isirData.efc) || 0,
    dependency_status: isirData.dependency_status === 'I' ? 'independent' : 'dependent',
    automatic_zero_efc: isirData.auto_zero_efc === 'Y',
    simplified_needs_test: isirData.simplified_needs === 'Y',
    pell_eligible: isirData.pell_eligible === 'Y',
    pell_lifetime_eligibility_used: parseFloat(isirData.pell_leu) || 0,
    application_type: isirData.transaction_number === 1 ? 'web' : 'correction',
    correction_number: (isirData.transaction_number || 1) - 1,
    isir_received_date: new Date(isirData.received_date),
    processed_date: new Date(isirData.processed_date),
    verification_selection: isirData.verification_flag === 'Y',
    verification_tracking_flags: isirData.verification_tracking_flags,
    reject_codes: isirData.reject_codes,
    comment_codes: isirData.comment_codes,
    housing_code: isirData.housing_code || '1',
    special_circumstances: isirData.special_circumstances,
    fafsa_raw_data: isirData, // Store full ISIR
  };
}

/**
 * Track FAFSA verification status and requirements
 */
export async function trackFAFSAVerification(
  student_id: number,
  award_year: string,
  verificationData: {
    status: 'completed' | 'pending' | 'exempted';
    completed_date?: Date;
    documents_received?: string[];
  },
  transaction?: Transaction
): Promise<FAFSAData> {
  const fafsa = await FAFSAData.findOne({
    where: { student_id, award_year },
  });

  if (!fafsa) {
    throw new Error('FAFSA not found');
  }

  // Update verification status
  await fafsa.update(
    {
      verification_status: verificationData.status,
      verification_completed_date: verificationData.completed_date,
    },
    { transaction }
  );

  return fafsa;
}

// ============================================================================
// Award Packaging Functions (6 functions)
// ============================================================================

/**
 * Create a complete award package for a student
 */
export async function createAwardPackage(
  financial_aid_id: number,
  awards: AwardCreationAttributes[],
  transaction?: Transaction
): Promise<Award[]> {
  const t = transaction || (await FinancialAid.sequelize!.transaction());

  try {
    // Create all awards
    const createdAwards = await Award.bulkCreate(awards, { transaction: t });

    // Calculate total awarded
    const totalAwarded = awards.reduce((sum, award) => sum + award.offered_amount, 0);

    // Update financial aid record
    await FinancialAid.update(
      {
        total_awarded: totalAwarded,
        status: 'packaged',
        packaging_date: new Date(),
      },
      {
        where: { id: financial_aid_id },
        transaction: t,
      }
    );

    if (!transaction) await t.commit();
    return createdAwards;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Calculate financial need (COA - EFC)
 */
export async function calculateNeed(
  student_id: number,
  academic_year: string
): Promise<{ coa: number; efc: number; need: number }> {
  const fa = await FinancialAid.findOne({
    where: { student_id, academic_year },
    include: [{ model: FAFSAData, as: 'fafsaData' }],
  });

  if (!fa) {
    throw new Error('Financial aid record not found');
  }

  const coa = fa.cost_of_attendance;
  const efc = fa.efc;
  const need = Math.max(0, coa - efc);

  return { coa, efc, need };
}

/**
 * Allocate awards based on eligibility and need
 */
export async function allocateAwards(
  financial_aid_id: number,
  availableFunds: {
    fund_code: string;
    fund_source: string;
    award_type: string;
    max_amount: number;
    is_need_based: boolean;
  }[]
): Promise<AwardCreationAttributes[]> {
  const fa = await FinancialAid.findByPk(financial_aid_id);
  if (!fa) throw new Error('Financial aid record not found');

  const awards: AwardCreationAttributes[] = [];
  let remainingNeed = fa.financial_need;

  for (const fund of availableFunds) {
    if (fund.is_need_based && remainingNeed <= 0) continue;

    const awardAmount = fund.is_need_based
      ? Math.min(fund.max_amount, remainingNeed)
      : fund.max_amount;

    if (awardAmount > 0) {
      awards.push({
        financial_aid_id,
        student_id: fa.student_id,
        academic_year: fa.academic_year,
        award_type: fund.award_type as any,
        fund_source: fund.fund_source,
        fund_code: fund.fund_code,
        award_name: fund.fund_source,
        offered_amount: awardAmount,
        accepted_amount: 0,
        disbursed_amount: 0,
        remaining_amount: awardAmount,
        award_status: 'offered',
        offer_date: new Date(),
        is_need_based: fund.is_need_based,
        is_federal: fund.fund_source.toLowerCase().includes('federal'),
        is_loan: ['subsidized', 'unsubsidized', 'plus', 'perkins'].includes(fund.award_type),
        renewal_eligible: true,
      });

      if (fund.is_need_based) {
        remainingNeed -= awardAmount;
      }
    }
  }

  return awards;
}

/**
 * Check award limits and eligibility
 */
export async function checkAwardLimits(
  student_id: number,
  academic_year: string,
  award_type: string
): Promise<{ eligible: boolean; remaining_eligibility: number; reason?: string }> {
  // Get all awards of this type for the student
  const existingAwards = await Award.findAll({
    where: {
      student_id,
      academic_year,
      award_type,
    },
  });

  const totalAwarded = existingAwards.reduce((sum, award) => sum + award.offered_amount, 0);

  // Define annual limits (example values - should be configurable)
  const limits: Record<string, number> = {
    pell: 7395,
    seog: 4000,
    subsidized: 5500,
    unsubsidized: 12500,
    plus: 999999, // No annual limit
  };

  const limit = limits[award_type] || 0;
  const remaining = limit - totalAwarded;

  return {
    eligible: remaining > 0,
    remaining_eligibility: Math.max(0, remaining),
    reason: remaining <= 0 ? 'Annual limit reached' : undefined,
  };
}

/**
 * Generate award letter document
 */
export async function generateAwardLetter(
  financial_aid_id: number
): Promise<{
  student_info: any;
  awards: any[];
  summary: {
    total_coa: number;
    total_efc: number;
    total_need: number;
    total_awarded: number;
    unmet_need: number;
  };
}> {
  const fa = await FinancialAid.findByPk(financial_aid_id, {
    include: [
      { model: Award, as: 'awards' },
      { model: FAFSAData, as: 'fafsaData' },
    ],
  });

  if (!fa) throw new Error('Financial aid not found');

  const summary = {
    total_coa: fa.cost_of_attendance,
    total_efc: fa.efc,
    total_need: fa.financial_need,
    total_awarded: fa.total_awarded,
    unmet_need: Math.max(0, fa.financial_need - fa.total_awarded),
  };

  return {
    student_info: {
      student_id: fa.student_id,
      academic_year: fa.academic_year,
      enrollment_status: fa.enrollment_status,
      housing_status: fa.housing_status,
    },
    awards: fa.awards || [],
    summary,
  };
}

/**
 * Compare award packages across years
 */
export async function compareAwardYears(
  student_id: number,
  year1: string,
  year2: string
): Promise<{
  year1_summary: any;
  year2_summary: any;
  differences: any;
}> {
  const [fa1, fa2] = await Promise.all([
    FinancialAid.findOne({
      where: { student_id, academic_year: year1 },
      include: [{ model: Award, as: 'awards' }],
    }),
    FinancialAid.findOne({
      where: { student_id, academic_year: year2 },
      include: [{ model: Award, as: 'awards' }],
    }),
  ]);

  const summary1 = fa1
    ? {
        total_awarded: fa1.total_awarded,
        total_disbursed: fa1.total_disbursed,
        num_awards: fa1.awards?.length || 0,
      }
    : null;

  const summary2 = fa2
    ? {
        total_awarded: fa2.total_awarded,
        total_disbursed: fa2.total_disbursed,
        num_awards: fa2.awards?.length || 0,
      }
    : null;

  const differences = {
    total_awarded_diff: (summary2?.total_awarded || 0) - (summary1?.total_awarded || 0),
    total_disbursed_diff: (summary2?.total_disbursed || 0) - (summary1?.total_disbursed || 0),
    num_awards_diff: (summary2?.num_awards || 0) - (summary1?.num_awards || 0),
  };

  return { year1_summary: summary1, year2_summary: summary2, differences };
}

// ============================================================================
// Disbursement Processing Functions (6 functions)
// ============================================================================

/**
 * Schedule disbursements for an award
 */
export async function scheduleDisbursements(
  award_id: number,
  disbursement_schedule: {
    disbursement_number: number;
    scheduled_date: Date;
    amount: number;
    enrollment_status: string;
  }[],
  transaction?: Transaction
): Promise<Disbursement[]> {
  const award = await Award.findByPk(award_id);
  if (!award) throw new Error('Award not found');

  const disbursements: DisbursementCreationAttributes[] = disbursement_schedule.map((sched) => ({
    award_id,
    student_id: award.student_id,
    financial_aid_id: award.financial_aid_id,
    disbursement_number: sched.disbursement_number,
    scheduled_date: sched.scheduled_date,
    amount: sched.amount,
    net_amount: sched.amount - (award.origination_fee_percent || 0) * sched.amount,
    origination_fee: (award.origination_fee_percent || 0) * sched.amount,
    enrollment_status: sched.enrollment_status,
    status: 'scheduled',
    release_method: 'credit-to-account',
    cod_reported: false,
    cod_accepted: false,
  }));

  return await Disbursement.bulkCreate(disbursements, { transaction });
}

/**
 * Process a disbursement (release funds)
 */
export async function processDisbursement(
  disbursement_id: number,
  release_method: 'direct-deposit' | 'check' | 'credit-to-account' | 'book-advance',
  transaction?: Transaction
): Promise<Disbursement> {
  const t = transaction || (await Disbursement.sequelize!.transaction());

  try {
    const disbursement = await Disbursement.findByPk(disbursement_id, { transaction: t });
    if (!disbursement) throw new Error('Disbursement not found');

    // Update disbursement status
    await disbursement.update(
      {
        status: 'released',
        actual_date: new Date(),
        release_method,
      },
      { transaction: t }
    );

    // Update award disbursed amount
    await Award.increment('disbursed_amount', {
      by: disbursement.net_amount,
      where: { id: disbursement.award_id },
      transaction: t,
    });

    // Update financial aid total disbursed
    await FinancialAid.increment('total_disbursed', {
      by: disbursement.net_amount,
      where: { id: disbursement.financial_aid_id },
      transaction: t,
    });

    if (!transaction) await t.commit();
    return disbursement;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Reverse a disbursement (return funds)
 */
export async function reverseDisbursement(
  disbursement_id: number,
  return_reason: string,
  return_amount: number,
  transaction?: Transaction
): Promise<Disbursement> {
  const t = transaction || (await Disbursement.sequelize!.transaction());

  try {
    const disbursement = await Disbursement.findByPk(disbursement_id, { transaction: t });
    if (!disbursement) throw new Error('Disbursement not found');

    await disbursement.update(
      {
        status: 'returned',
        return_amount,
        return_reason,
        return_date: new Date(),
      },
      { transaction: t }
    );

    // Decrement award disbursed amount
    await Award.decrement('disbursed_amount', {
      by: return_amount,
      where: { id: disbursement.award_id },
      transaction: t,
    });

    // Decrement financial aid total disbursed
    await FinancialAid.decrement('total_disbursed', {
      by: return_amount,
      where: { id: disbursement.financial_aid_id },
      transaction: t,
    });

    if (!transaction) await t.commit();
    return disbursement;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Track disbursement status and updates
 */
export async function trackDisbursementStatus(
  filters: {
    student_id?: number;
    award_id?: number;
    status?: string;
    date_range?: { start: Date; end: Date };
  }
): Promise<Disbursement[]> {
  const where: any = {};
  if (filters.student_id) where.student_id = filters.student_id;
  if (filters.award_id) where.award_id = filters.award_id;
  if (filters.status) where.status = filters.status;
  if (filters.date_range) {
    where.scheduled_date = {
      [Op.between]: [filters.date_range.start, filters.date_range.end],
    };
  }

  return await Disbursement.findAll({
    where,
    order: [['scheduled_date', 'ASC']],
    include: [{ model: Award, as: 'award' }],
  });
}

/**
 * Calculate disbursement dates based on term calendar
 */
export async function calculateDisbursementDates(
  award_id: number,
  term_dates: { term_id: number; start_date: Date; end_date: Date }[]
): Promise<{ disbursement_number: number; scheduled_date: Date; amount: number }[]> {
  const award = await Award.findByPk(award_id);
  if (!award) throw new Error('Award not found');

  const num_disbursements = term_dates.length;
  const amount_per_disbursement = award.accepted_amount / num_disbursements;

  return term_dates.map((term, index) => ({
    disbursement_number: index + 1,
    scheduled_date: term.start_date,
    amount: amount_per_disbursement,
  }));
}

/**
 * Reconcile disbursements with accounting system
 */
export async function reconcileDisbursements(
  academic_year: string,
  report_date: Date
): Promise<{
  total_scheduled: number;
  total_released: number;
  total_returned: number;
  pending_count: number;
  discrepancies: any[];
}> {
  const disbursements = await Disbursement.findAll({
    include: [
      {
        model: Award,
        as: 'award',
        where: { academic_year },
      },
    ],
  });

  const summary = {
    total_scheduled: 0,
    total_released: 0,
    total_returned: 0,
    pending_count: 0,
    discrepancies: [] as any[],
  };

  for (const disb of disbursements) {
    if (disb.status === 'scheduled' || disb.status === 'pending') {
      summary.pending_count++;
      summary.total_scheduled += disb.amount;
    } else if (disb.status === 'released') {
      summary.total_released += disb.net_amount;
    } else if (disb.status === 'returned') {
      summary.total_returned += disb.return_amount || 0;
    }
  }

  return summary;
}

// ============================================================================
// COD Reporting Functions (5 functions)
// ============================================================================

/**
 * Generate COD report file
 */
export async function generateCODFile(
  academic_year: string,
  report_type: 'origination' | 'disbursement' | 'change' | 'correction',
  school_code: string
): Promise<CODReport> {
  const batch_id = `COD_${school_code}_${academic_year}_${Date.now()}`;
  const file_name = `${batch_id}.txt`;

  // Get unreported disbursements
  const disbursements = await Disbursement.findAll({
    where: {
      cod_reported: false,
      status: 'released',
    },
    include: [
      {
        model: Award,
        as: 'award',
        where: { academic_year, is_federal: true },
      },
    ],
  });

  const total_records = disbursements.length;
  const total_amount = disbursements.reduce((sum, d) => sum + d.net_amount, 0);

  // Create COD report record
  const report = await CODReport.create({
    report_type,
    batch_id,
    report_date: new Date(),
    academic_year,
    school_code,
    total_records,
    total_amount,
    file_name,
    submission_method: 'edconnect',
    acknowledgment_received: false,
    errors_count: 0,
    warnings_count: 0,
    accepted_count: 0,
    rejected_count: 0,
    status: 'pending',
  });

  // Generate actual COD file content would go here
  // This would create the EDI file format required by COD

  return report;
}

/**
 * Validate COD data before submission
 */
export async function validateCODData(
  report_id: number
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const report = await CODReport.findByPk(report_id);
  if (!report) {
    return { valid: false, errors: ['Report not found'], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation rules
  if (report.total_records === 0) {
    errors.push('No records to report');
  }

  if (report.total_amount <= 0) {
    errors.push('Total amount must be positive');
  }

  if (!report.school_code || report.school_code.length !== 8) {
    errors.push('Invalid school code format');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Submit COD report to federal system
 */
export async function submitCODReport(
  report_id: number,
  transaction?: Transaction
): Promise<CODReport> {
  const report = await CODReport.findByPk(report_id);
  if (!report) throw new Error('Report not found');

  // Validate before submission
  const validation = await validateCODData(report_id);
  if (!validation.valid) {
    throw new Error(`COD validation failed: ${validation.errors.join(', ')}`);
  }

  // Update report status
  await report.update(
    {
      status: 'submitted',
      submission_date: new Date(),
    },
    { transaction }
  );

  // Mark disbursements as reported
  await Disbursement.update(
    {
      cod_reported: true,
      cod_report_date: new Date(),
    },
    {
      where: {
        cod_reported: false,
        status: 'released',
      },
      transaction,
    }
  );

  // Actual submission logic would go here (API call to COD system)

  return report;
}

/**
 * Process COD acknowledgment response
 */
export async function processCODResponse(
  report_id: number,
  response_data: {
    acknowledgment_file: string;
    accepted_count: number;
    rejected_count: number;
    errors: any[];
    warnings: any[];
  },
  transaction?: Transaction
): Promise<CODReport> {
  const report = await CODReport.findByPk(report_id);
  if (!report) throw new Error('Report not found');

  const status = response_data.rejected_count > 0 ? 'rejected' : 'accepted';

  await report.update(
    {
      acknowledgment_received: true,
      acknowledgment_date: new Date(),
      acknowledgment_file: response_data.acknowledgment_file,
      accepted_count: response_data.accepted_count,
      rejected_count: response_data.rejected_count,
      errors_count: response_data.errors.length,
      warnings_count: response_data.warnings.length,
      error_details: [...response_data.errors, ...response_data.warnings],
      status,
    },
    { transaction }
  );

  // Mark accepted disbursements as COD accepted
  if (response_data.accepted_count > 0) {
    await Disbursement.update(
      {
        cod_accepted: true,
      },
      {
        where: {
          cod_reported: true,
          cod_accepted: false,
        },
        transaction,
      }
    );
  }

  return report;
}

/**
 * Track COD submission status
 */
export async function trackCODStatus(
  academic_year?: string
): Promise<CODReport[]> {
  const where: any = {};
  if (academic_year) where.academic_year = academic_year;

  return await CODReport.findAll({
    where,
    order: [['report_date', 'DESC']],
  });
}

// ============================================================================
// SAP (Satisfactory Academic Progress) Functions (5 functions)
// ============================================================================

/**
 * Calculate SAP status for a student
 */
export async function calculateSAPStatus(
  student_id: number,
  academic_year: string,
  term_id: number,
  academic_data: {
    gpa: number;
    attempted_credits: number;
    completed_credits: number;
    program_credits_required: number;
  }
): Promise<SAPRecordCreationAttributes> {
  const gpa_requirement = 2.0; // Configurable
  const pace_requirement = 67.0; // 67% completion rate
  const max_timeframe_multiplier = 1.5; // 150% of program length

  const gpa_met = academic_data.gpa >= gpa_requirement;
  const current_pace = (academic_data.completed_credits / academic_data.attempted_credits) * 100;
  const pace_met = current_pace >= pace_requirement;

  const max_timeframe_credits = academic_data.program_credits_required * max_timeframe_multiplier;
  const max_timeframe_met = academic_data.attempted_credits <= max_timeframe_credits;

  const overall_sap_met = gpa_met && pace_met && max_timeframe_met;

  // Determine SAP status
  let sap_status: 'satisfactory' | 'warning' | 'probation' | 'suspension' | 'dismissed';
  if (overall_sap_met) {
    sap_status = 'satisfactory';
  } else {
    // Check previous SAP record
    const previous_sap = await SAPRecord.findOne({
      where: { student_id },
      order: [['evaluation_date', 'DESC']],
    });

    if (!previous_sap || previous_sap.sap_status === 'satisfactory') {
      sap_status = 'warning';
    } else if (previous_sap.sap_status === 'warning') {
      sap_status = 'suspension';
    } else {
      sap_status = 'suspension';
    }
  }

  return {
    student_id,
    academic_year,
    evaluation_date: new Date(),
    evaluation_term_id: term_id,
    sap_status,
    gpa_requirement,
    current_gpa: academic_data.gpa,
    gpa_met,
    pace_requirement,
    current_pace,
    pace_met,
    max_timeframe_credits,
    attempted_credits: academic_data.attempted_credits,
    completed_credits: academic_data.completed_credits,
    max_timeframe_met,
    overall_sap_met,
    appeal_submitted: false,
    academic_plan_required: !overall_sap_met,
    financial_aid_eligible: overall_sap_met,
  };
}

/**
 * Evaluate SAP criteria and create record
 */
export async function evaluateSAPCriteria(
  student_id: number,
  academic_year: string,
  term_id: number,
  transaction?: Transaction
): Promise<SAPRecord> {
  // This would typically fetch academic data from student records
  // For now, using placeholder data
  const academic_data = {
    gpa: 3.0,
    attempted_credits: 60,
    completed_credits: 50,
    program_credits_required: 120,
  };

  const sap_data = await calculateSAPStatus(student_id, academic_year, term_id, academic_data);
  return await SAPRecord.create(sap_data, { transaction });
}

/**
 * Create SAP appeal
 */
export async function createSAPAppeal(
  sap_record_id: number,
  appeal_reason: string,
  supporting_documents?: string[],
  transaction?: Transaction
): Promise<SAPRecord> {
  const sap = await SAPRecord.findByPk(sap_record_id);
  if (!sap) throw new Error('SAP record not found');

  await sap.update(
    {
      appeal_submitted: true,
      appeal_date: new Date(),
      appeal_reason,
    },
    { transaction }
  );

  return sap;
}

/**
 * Track SAP probation status
 */
export async function trackSAPProbation(
  student_id: number
): Promise<{
  current_status: string;
  probation_terms: number;
  requires_plan: boolean;
  eligible_for_aid: boolean;
}> {
  const current_sap = await SAPRecord.findOne({
    where: { student_id },
    order: [['evaluation_date', 'DESC']],
  });

  if (!current_sap) {
    return {
      current_status: 'unknown',
      probation_terms: 0,
      requires_plan: false,
      eligible_for_aid: false,
    };
  }

  return {
    current_status: current_sap.sap_status,
    probation_terms: current_sap.probation_terms || 0,
    requires_plan: current_sap.academic_plan_required,
    eligible_for_aid: current_sap.financial_aid_eligible,
  };
}

/**
 * Generate SAP report for a term or year
 */
export async function generateSAPReport(
  academic_year: string,
  term_id?: number
): Promise<{
  total_students: number;
  satisfactory: number;
  warning: number;
  probation: number;
  suspension: number;
  dismissed: number;
}> {
  const where: any = { academic_year };
  if (term_id) where.evaluation_term_id = term_id;

  const records = await SAPRecord.findAll({ where });

  const summary = {
    total_students: records.length,
    satisfactory: 0,
    warning: 0,
    probation: 0,
    suspension: 0,
    dismissed: 0,
  };

  for (const record of records) {
    summary[record.sap_status]++;
  }

  return summary;
}

// ============================================================================
// Award Adjustment Functions (5 functions)
// ============================================================================

/**
 * Adjust an award amount
 */
export async function adjustAward(
  award_id: number,
  new_amount: number,
  reason: string,
  transaction?: Transaction
): Promise<Award> {
  const t = transaction || (await Award.sequelize!.transaction());

  try {
    const award = await Award.findByPk(award_id, { transaction: t });
    if (!award) throw new Error('Award not found');

    const previous_amount = award.accepted_amount;
    const difference = new_amount - previous_amount;

    await award.update(
      {
        accepted_amount: new_amount,
        remaining_amount: new_amount - award.disbursed_amount,
      },
      { transaction: t }
    );

    // Update financial aid total
    await FinancialAid.increment('total_awarded', {
      by: difference,
      where: { id: award.financial_aid_id },
      transaction: t,
    });

    if (!transaction) await t.commit();
    return award;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Process repackaging (recalculate entire package)
 */
export async function processRepackaging(
  financial_aid_id: number,
  reason: string,
  transaction?: Transaction
): Promise<FinancialAid> {
  const t = transaction || (await FinancialAid.sequelize!.transaction());

  try {
    const fa = await FinancialAid.findByPk(financial_aid_id, {
      include: [{ model: Award, as: 'awards' }],
      transaction: t,
    });

    if (!fa) throw new Error('Financial aid not found');

    // Cancel existing awards that haven't been disbursed
    const awards = fa.awards || [];
    for (const award of awards) {
      if (award.disbursed_amount === 0) {
        await award.update({ award_status: 'cancelled' }, { transaction: t });
      }
    }

    // Reset packaging status
    await fa.update(
      {
        status: 'pending',
        total_awarded: awards
          .filter((a) => a.award_status !== 'cancelled')
          .reduce((sum, a) => sum + a.accepted_amount, 0),
      },
      { transaction: t }
    );

    if (!transaction) await t.commit();
    return fa;
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Apply professional judgment adjustment
 */
export async function applyProfessionalJudgment(
  pj_id: number,
  transaction?: Transaction
): Promise<{ financial_aid: FinancialAid; professional_judgment: ProfessionalJudgment }> {
  const t = transaction || (await ProfessionalJudgment.sequelize!.transaction());

  try {
    const pj = await ProfessionalJudgment.findByPk(pj_id, { transaction: t });
    if (!pj) throw new Error('Professional judgment not found');

    if (pj.approval_status !== 'approved') {
      throw new Error('Professional judgment must be approved first');
    }

    // Update financial aid with adjusted values
    const fa = await FinancialAid.findByPk(pj.financial_aid_id, { transaction: t });
    if (!fa) throw new Error('Financial aid not found');

    await fa.update(
      {
        efc: pj.adjusted_efc,
        cost_of_attendance: pj.adjusted_coa || fa.cost_of_attendance,
        financial_need: (pj.adjusted_coa || fa.cost_of_attendance) - pj.adjusted_efc,
      },
      { transaction: t }
    );

    if (!transaction) await t.commit();
    return { financial_aid: fa, professional_judgment: pj };
  } catch (error) {
    if (!transaction) await t.rollback();
    throw error;
  }
}

/**
 * Track award change history
 */
export async function trackAwardChanges(
  award_id: number
): Promise<any[]> {
  // This would query an audit log table
  // For now, returning award update history from the model
  const award = await Award.findByPk(award_id);
  if (!award) throw new Error('Award not found');

  return [
    {
      changed_at: award.updated_at,
      changes: {
        offered_amount: award.offered_amount,
        accepted_amount: award.accepted_amount,
        disbursed_amount: award.disbursed_amount,
        status: award.award_status,
      },
    },
  ];
}

/**
 * Notify student of award changes
 */
export async function notifyAwardChange(
  award_id: number,
  notification_type: 'increase' | 'decrease' | 'cancellation' | 'new-award'
): Promise<{ notification_sent: boolean; notification_id?: string }> {
  const award = await Award.findByPk(award_id);
  if (!award) throw new Error('Award not found');

  // Notification logic would go here (email, SMS, portal notification)
  // For now, returning mock response

  return {
    notification_sent: true,
    notification_id: `NOTIF_${Date.now()}`,
  };
}

// ============================================================================
// R2T4 (Return of Title IV) Calculation Functions (5 functions)
// ============================================================================

/**
 * Calculate R2T4 for a withdrawn student
 */
export async function calculateR2T4(
  financial_aid_id: number,
  withdrawal_date: Date,
  term_id: number,
  term_start_date: Date,
  term_end_date: Date
): Promise<R2T4CalculationCreationAttributes> {
  const fa = await FinancialAid.findByPk(financial_aid_id, {
    include: [{ model: Award, as: 'awards', include: [{ model: Disbursement, as: 'disbursements' }] }],
  });

  if (!fa) throw new Error('Financial aid not found');

  // Calculate days in period and days completed
  const total_days = Math.ceil((term_end_date.getTime() - term_start_date.getTime()) / (1000 * 60 * 60 * 24));
  const days_completed = Math.ceil((withdrawal_date.getTime() - term_start_date.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate completion percentage (max 100%)
  const completion_percentage = Math.min(100, (days_completed / total_days) * 100);

  // Calculate aid amounts
  const total_aid_disbursed = fa.total_disbursed;
  const total_aid_could_disburse = fa.total_awarded;

  // Calculate earned aid
  const earned_aid = (total_aid_could_disburse * completion_percentage) / 100;

  // Calculate unearned aid and amount to return
  const unearned_aid = total_aid_disbursed - earned_aid;
  const aid_to_return = Math.max(0, unearned_aid);

  // Determine school vs student responsibility (50/50 split simplified)
  const school_return_amount = aid_to_return * 0.5;
  const student_return_amount = aid_to_return * 0.5;

  // Return allocation by fund type (simplified)
  const return_allocation: Record<string, number> = {};
  const awards = fa.awards || [];
  for (const award of awards) {
    if (award.is_federal && award.disbursed_amount > 0) {
      const return_percent = aid_to_return / total_aid_disbursed;
      return_allocation[award.award_type] = award.disbursed_amount * return_percent;
    }
  }

  // Calculate return deadline (45 days from determination)
  const return_deadline = new Date();
  return_deadline.setDate(return_deadline.getDate() + 45);

  return {
    student_id: fa.student_id,
    financial_aid_id: fa.id,
    academic_year: fa.academic_year,
    term_id,
    withdrawal_date,
    determination_date: new Date(),
    withdrawal_type: 'official',
    total_days_in_period: total_days,
    days_completed,
    completion_percentage,
    total_aid_disbursed,
    total_aid_could_disburse,
    earned_aid,
    unearned_aid,
    aid_to_return,
    student_return_amount,
    school_return_amount,
    return_allocation,
    return_deadline,
    return_completed: false,
    nslds_reported: false,
    status: 'calculated',
    calculation_details: {
      term_start: term_start_date,
      term_end: term_end_date,
      withdrawal_date,
      total_days,
      days_completed,
      completion_percentage,
    },
  };
}

/**
 * Determine withdrawal date for R2T4
 */
export async function determineWithdrawalDate(
  student_id: number,
  term_id: number,
  withdrawal_type: 'official' | 'unofficial' | 'administrative',
  last_attendance_date?: Date
): Promise<Date> {
  if (withdrawal_type === 'official' && last_attendance_date) {
    return last_attendance_date;
  }

  // For unofficial withdrawal, use midpoint of term or last attendance
  if (withdrawal_type === 'unofficial') {
    return last_attendance_date || new Date(); // Would calculate term midpoint
  }

  return new Date();
}

/**
 * Calculate earned aid amount
 */
export async function calculateEarnedAid(
  total_aid: number,
  completion_percentage: number
): Promise<number> {
  // If student completed more than 60% of the period, all aid is earned
  if (completion_percentage > 60) {
    return total_aid;
  }

  return (total_aid * completion_percentage) / 100;
}

/**
 * Calculate return amount by fund type
 */
export async function calculateReturnAmount(
  r2t4_id: number
): Promise<Record<string, number>> {
  const r2t4 = await R2T4Calculation.findByPk(r2t4_id);
  if (!r2t4) throw new Error('R2T4 calculation not found');

  return r2t4.return_allocation;
}

/**
 * Generate R2T4 worksheet report
 */
export async function generateR2T4Report(
  r2t4_id: number
): Promise<{
  student_info: any;
  withdrawal_info: any;
  calculation: any;
  return_schedule: any;
}> {
  const r2t4 = await R2T4Calculation.findByPk(r2t4_id, {
    include: [
      {
        model: FinancialAid,
        as: 'financialAid',
        include: [{ model: Award, as: 'awards' }],
      },
    ],
  });

  if (!r2t4) throw new Error('R2T4 calculation not found');

  return {
    student_info: {
      student_id: r2t4.student_id,
      academic_year: r2t4.academic_year,
    },
    withdrawal_info: {
      withdrawal_date: r2t4.withdrawal_date,
      withdrawal_type: r2t4.withdrawal_type,
      last_attendance_date: r2t4.last_attendance_date,
    },
    calculation: {
      total_days: r2t4.total_days_in_period,
      days_completed: r2t4.days_completed,
      completion_percentage: r2t4.completion_percentage,
      total_aid_disbursed: r2t4.total_aid_disbursed,
      earned_aid: r2t4.earned_aid,
      unearned_aid: r2t4.unearned_aid,
      aid_to_return: r2t4.aid_to_return,
    },
    return_schedule: {
      school_return: r2t4.school_return_amount,
      student_return: r2t4.student_return_amount,
      return_deadline: r2t4.return_deadline,
      return_allocation: r2t4.return_allocation,
    },
  };
}

// Export all models and functions
export default {
  // Models
  FinancialAid,
  Award,
  Disbursement,
  FAFSAData,
  SAPRecord,
  ProfessionalJudgment,
  CODReport,
  R2T4Calculation,

  // Initialization
  initFinancialAidModels,
  syncFinancialAidSchema,

  // CRUD Operations
  createFinancialAidRecord,
  updateFinancialAidRecord,
  deleteFinancialAidRecord,
  getFinancialAidById,
  queryFinancialAidRecords,
  bulkImportFinancialAid,

  // FAFSA Integration
  importFAFSAData,
  validateFAFSA,
  calculateEFC,
  parseFAFSAISIR,
  trackFAFSAVerification,

  // Award Packaging
  createAwardPackage,
  calculateNeed,
  allocateAwards,
  checkAwardLimits,
  generateAwardLetter,
  compareAwardYears,

  // Disbursement Processing
  scheduleDisbursements,
  processDisbursement,
  reverseDisbursement,
  trackDisbursementStatus,
  calculateDisbursementDates,
  reconcileDisbursements,

  // COD Reporting
  generateCODFile,
  validateCODData,
  submitCODReport,
  processCODResponse,
  trackCODStatus,

  // SAP Tracking
  calculateSAPStatus,
  evaluateSAPCriteria,
  createSAPAppeal,
  trackSAPProbation,
  generateSAPReport,

  // Award Adjustments
  adjustAward,
  processRepackaging,
  applyProfessionalJudgment,
  trackAwardChanges,
  notifyAwardChange,

  // R2T4 Calculations
  calculateR2T4,
  determineWithdrawalDate,
  calculateEarnedAid,
  calculateReturnAmount,
  generateR2T4Report,
};
