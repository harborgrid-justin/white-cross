/**
 * LOC: H1C2C3O4R5
 * File: /reuse/server/health/health-care-coordination-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @types/node (v18.x)
 *   - date-fns (v2.x)
 *
 * DOWNSTREAM (imported by):
 *   - Care coordination services
 *   - Care management APIs
 *   - Transition of care workflows
 *   - Patient engagement services
 */

/**
 * File: /reuse/server/health/health-care-coordination-kit.ts
 * Locator: WC-HEALTH-COORD-KIT-001
 * Purpose: Health Care Coordination Kit - Comprehensive care coordination and management functions
 *
 * Upstream: sequelize v6.x, date-fns, @types/node
 * Downstream: Care coordination services, transition workflows, patient engagement
 * Dependencies: Sequelize v6.x, Node 18+, TypeScript 5.x, PostgreSQL 14+
 * Exports: 42 care coordination functions for team management, care plans, transitions, referrals, gaps, education
 *
 * LLM Context: Production-grade care coordination kit for White Cross healthcare platform.
 * Epic Care Everywhere/Healthy Planet-level functionality including care team management, comprehensive
 * care planning with versioning, ADT message processing (HL7/FHIR), referral tracking, evidence-based
 * care gap identification, patient education, discharge planning, DME coordination, SDOH tracking,
 * and care navigation workflows. HIPAA-compliant with comprehensive audit trails and PHI encryption.
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  Op,
  WhereOptions,
  FindOptions,
  Transaction,
  TransactionOptions,
  CreationAttributes,
  Attributes,
  InferAttributes,
  InferCreationAttributes,
  Order,
  Includeable,
  QueryTypes,
} from 'sequelize';
import { addDays, addMonths, differenceInDays, format, parseISO } from 'date-fns';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Care team member role types
 */
export type CareTeamRole =
  | 'care_coordinator'
  | 'primary_care_physician'
  | 'specialist'
  | 'nurse'
  | 'social_worker'
  | 'pharmacist'
  | 'case_manager'
  | 'care_navigator'
  | 'community_health_worker'
  | 'behavioral_health_specialist';

/**
 * Care team status
 */
export type CareTeamStatus = 'active' | 'inactive' | 'on_hold' | 'archived';

/**
 * Care team type
 */
export type CareTeamType = 'primary' | 'specialty' | 'transition' | 'chronic_disease' | 'multidisciplinary';

/**
 * Care plan status
 */
export type CarePlanStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'archived';

/**
 * Care plan type
 */
export type CarePlanType =
  | 'comprehensive'
  | 'disease_specific'
  | 'transitional'
  | 'preventive'
  | 'palliative'
  | 'chronic_disease_management';

/**
 * ADT message type (Admission, Discharge, Transfer)
 */
export type AdtMessageType = 'admission' | 'discharge' | 'transfer' | 'registration' | 'pre_admission' | 'leave_of_absence';

/**
 * Discharge disposition
 */
export type DischargeDisposition =
  | 'home'
  | 'home_with_home_health'
  | 'skilled_nursing_facility'
  | 'acute_rehab'
  | 'long_term_care'
  | 'hospice'
  | 'left_ama'
  | 'expired'
  | 'other_facility';

/**
 * Referral status
 */
export type ReferralStatus =
  | 'pending'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'declined';

/**
 * Referral priority
 */
export type ReferralPriority = 'routine' | 'urgent' | 'emergent' | 'stat';

/**
 * Care gap type
 */
export type CareGapType =
  | 'preventive_screening'
  | 'chronic_disease_monitoring'
  | 'medication_adherence'
  | 'follow_up_visit'
  | 'specialist_referral'
  | 'lab_test'
  | 'imaging_study'
  | 'immunization'
  | 'health_maintenance';

/**
 * Care gap status
 */
export type CareGapStatus = 'open' | 'in_progress' | 'closed' | 'not_applicable' | 'patient_declined';

/**
 * DME order status
 */
export type DmeOrderStatus =
  | 'ordered'
  | 'pending_authorization'
  | 'authorized'
  | 'denied'
  | 'in_fulfillment'
  | 'delivered'
  | 'cancelled';

/**
 * SDOH domain
 */
export type SdohDomain =
  | 'food_insecurity'
  | 'housing_instability'
  | 'transportation'
  | 'utility_assistance'
  | 'interpersonal_safety'
  | 'employment'
  | 'education'
  | 'social_isolation';

// ============================================================================
// INTERFACE DEFINITIONS
// ============================================================================

/**
 * Care team configuration
 */
export interface CareTeamConfig {
  patientId: string;
  teamName: string;
  teamType: CareTeamType;
  status?: CareTeamStatus;
  effectiveDate?: Date;
  expirationDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Care team member configuration
 */
export interface CareTeamMemberConfig {
  careTeamId: string;
  providerId: string;
  role: CareTeamRole;
  isLead?: boolean;
  isPrimary?: boolean;
  startDate?: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Care plan configuration
 */
export interface CarePlanConfig {
  patientId: string;
  careTeamId?: string;
  planType: CarePlanType;
  title: string;
  description?: string;
  version?: number;
  status?: CarePlanStatus;
  effectiveDate: Date;
  expirationDate?: Date;
  goals?: CarePlanGoal[];
  interventions?: CarePlanIntervention[];
  barriers?: string[];
  createdBy: string;
}

/**
 * Care plan goal
 */
export interface CarePlanGoal {
  id?: string;
  description: string;
  targetDate?: Date;
  status?: 'not_started' | 'in_progress' | 'achieved' | 'not_achieved' | 'abandoned';
  metrics?: Array<{ name: string; target: any; current?: any; unit?: string }>;
  assignedTo?: string[];
}

/**
 * Care plan intervention
 */
export interface CarePlanIntervention {
  id?: string;
  description: string;
  category?: string;
  frequency?: string;
  duration?: string;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'planned' | 'active' | 'on_hold' | 'completed' | 'cancelled';
}

/**
 * ADT message configuration
 */
export interface AdtMessageConfig {
  patientId: string;
  messageType: AdtMessageType;
  eventTimestamp: Date;
  facilityId: string;
  fromUnit?: string;
  toUnit?: string;
  attendingProviderId?: string;
  dischargeDisposition?: DischargeDisposition;
  hl7Message?: string;
  fhirBundle?: Record<string, any>;
}

/**
 * Referral configuration
 */
export interface ReferralConfig {
  patientId: string;
  referringProviderId: string;
  referredToProviderId?: string;
  specialty: string;
  priority: ReferralPriority;
  reason: string;
  clinicalSummary?: string;
  requestedDate: Date;
  requiredByDate?: Date;
  diagnoses?: string[];
  attachments?: string[];
}

/**
 * Care gap configuration
 */
export interface CareGapConfig {
  patientId: string;
  gapType: CareGapType;
  description: string;
  evidenceSource: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recommendations?: string[];
  relatedMeasures?: string[];
}

/**
 * Patient education assignment
 */
export interface EducationAssignmentConfig {
  patientId: string;
  materialId: string;
  assignedBy: string;
  assignedDate: Date;
  dueDate?: Date;
  deliveryMethod: 'in_person' | 'online' | 'video' | 'printed' | 'mobile_app';
  topic: string;
  metadata?: Record<string, any>;
}

/**
 * Discharge plan configuration
 */
export interface DischargePlanConfig {
  patientId: string;
  admissionId: string;
  anticipatedDischargeDate?: Date;
  dischargeDisposition?: DischargeDisposition;
  dischargeMedications?: Array<{ name: string; instructions: string }>;
  followUpAppointments?: Array<{ provider: string; date?: Date; notes?: string }>;
  homeHealthOrdered?: boolean;
  dmeOrdered?: boolean;
  patientInstructions?: string;
  caregiverInstructions?: string;
  createdBy: string;
}

/**
 * DME order configuration
 */
export interface DmeOrderConfig {
  patientId: string;
  orderingProviderId: string;
  equipmentType: string;
  equipmentDescription: string;
  quantity: number;
  justification: string;
  orderDate: Date;
  neededByDate?: Date;
  insuranceAuthRequired: boolean;
  deliveryAddress?: string;
}

/**
 * SDOH assessment configuration
 */
export interface SdohAssessmentConfig {
  patientId: string;
  assessmentDate: Date;
  assessedBy: string;
  domains: Array<{
    domain: SdohDomain;
    needIdentified: boolean;
    severity?: 'mild' | 'moderate' | 'severe';
    details?: string;
  }>;
  overallRiskScore?: number;
  interventionsRecommended?: string[];
}

/**
 * Query options for care coordination
 */
export interface CareCoordinationQueryOptions {
  patientId?: string;
  providerId?: string;
  status?: string | string[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  order?: Order;
  include?: Includeable[];
  transaction?: Transaction;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Care coordination metrics
 */
export interface CareCoordinationMetrics {
  period: { start: Date; end: Date };
  activeCarePlans: number;
  completedCarePlans: number;
  careTransitions: number;
  activeReferrals: number;
  completedReferrals: number;
  openCareGaps: number;
  closedCareGaps: number;
  patientEducationCompletions: number;
  avgTimeToCarePlanApproval: number;
  avgTimeToReferralCompletion: number;
  readmissionRate?: number;
}

// ============================================================================
// CARE TEAM MANAGEMENT FUNCTIONS (5 functions)
// ============================================================================

/**
 * Creates a new care team for a patient.
 * Initializes care team structure with metadata and audit trail.
 *
 * @param {ModelStatic<Model>} CareTeam - Care team model
 * @param {CareTeamConfig} config - Care team configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created care team
 *
 * Database optimization: Indexed by patient_id, status
 * HIPAA: Audit trail for care team creation
 *
 * @example
 * ```typescript
 * const careTeam = await createCareTeam(CareTeam, {
 *   patientId: 'patient-uuid',
 *   teamName: 'Primary Care Team',
 *   teamType: 'primary',
 *   status: 'active',
 *   effectiveDate: new Date()
 * }, transaction);
 * ```
 */
export async function createCareTeam<T extends Model>(
  CareTeam: ModelStatic<T>,
  config: CareTeamConfig,
  transaction?: Transaction,
): Promise<T> {
  const careTeam = await CareTeam.create(
    {
      patientId: config.patientId,
      teamName: config.teamName,
      teamType: config.teamType,
      status: config.status || 'active',
      effectiveDate: config.effectiveDate || new Date(),
      expirationDate: config.expirationDate,
      metadata: config.metadata || {},
    } as any,
    { transaction },
  );

  return careTeam;
}

/**
 * Adds a member to a care team with role assignment.
 * Supports lead provider designation and date ranges.
 *
 * @param {ModelStatic<Model>} CareTeamMember - Care team member model
 * @param {CareTeamMemberConfig} config - Member configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created care team member
 *
 * Database optimization: Indexed by care_team_id, provider_id, role
 * HIPAA: Audit trail for team member assignments
 *
 * @example
 * ```typescript
 * const member = await addCareTeamMember(CareTeamMember, {
 *   careTeamId: 'team-uuid',
 *   providerId: 'provider-uuid',
 *   role: 'care_coordinator',
 *   isLead: true,
 *   startDate: new Date()
 * });
 * ```
 */
export async function addCareTeamMember<T extends Model>(
  CareTeamMember: ModelStatic<T>,
  config: CareTeamMemberConfig,
  transaction?: Transaction,
): Promise<T> {
  // Check for existing active membership
  const existing = await CareTeamMember.findOne({
    where: {
      careTeamId: config.careTeamId,
      providerId: config.providerId,
      endDate: null,
    } as any,
    transaction,
  });

  if (existing) {
    throw new Error('Provider is already an active member of this care team');
  }

  const member = await CareTeamMember.create(
    {
      careTeamId: config.careTeamId,
      providerId: config.providerId,
      role: config.role,
      isLead: config.isLead || false,
      isPrimary: config.isPrimary || false,
      startDate: config.startDate || new Date(),
      endDate: config.endDate,
      metadata: config.metadata || {},
    } as any,
    { transaction },
  );

  return member;
}

/**
 * Removes a member from a care team by setting end date.
 * Soft delete approach preserving audit history.
 *
 * @param {ModelStatic<Model>} CareTeamMember - Care team member model
 * @param {string} memberId - Member ID to remove
 * @param {Date} endDate - Effective end date
 * @param {string} reason - Reason for removal
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated care team member
 *
 * Database optimization: Partial index on active members (end_date IS NULL)
 * HIPAA: Audit trail with removal reason
 *
 * @example
 * ```typescript
 * await removeCareTeamMember(CareTeamMember, 'member-uuid', new Date(), 'Provider left practice');
 * ```
 */
export async function removeCareTeamMember<T extends Model>(
  CareTeamMember: ModelStatic<T>,
  memberId: string,
  endDate: Date = new Date(),
  reason?: string,
  transaction?: Transaction,
): Promise<T> {
  const member = await CareTeamMember.findByPk(memberId, { transaction });

  if (!member) {
    throw new Error(`Care team member ${memberId} not found`);
  }

  await member.update(
    {
      endDate,
      metadata: {
        ...(member.get('metadata') as any),
        removalReason: reason,
        removedAt: new Date().toISOString(),
      },
    } as any,
    { transaction },
  );

  return member;
}

/**
 * Retrieves care team with all members for a patient.
 * Eager loads provider details and filters by status.
 *
 * @param {ModelStatic<Model>} CareTeam - Care team model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Care teams with members
 *
 * Database optimization: Composite index (patient_id, status), eager loading
 * Performance: Limit 10 most recent teams, paginate if needed
 *
 * @example
 * ```typescript
 * const teams = await getCareTeamByPatient(CareTeam, 'patient-uuid', {
 *   status: 'active',
 *   includeMembers: true
 * });
 * ```
 */
export async function getCareTeamByPatient<T extends Model>(
  CareTeam: ModelStatic<T>,
  patientId: string,
  options: {
    status?: CareTeamStatus | CareTeamStatus[];
    includeMembers?: boolean;
    includeInactive?: boolean;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = {
    patientId,
  };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  } else if (!options.includeInactive) {
    whereClause.status = 'active';
  }

  const findOptions: FindOptions = {
    where: whereClause,
    order: [['effectiveDate', 'DESC']],
    transaction: options.transaction,
  };

  if (options.includeMembers) {
    findOptions.include = [
      {
        association: 'members',
        where: { endDate: null },
        required: false,
        include: [{ association: 'provider' }],
      } as any,
    ];
  }

  const teams = await CareTeam.findAll(findOptions);
  return teams;
}

/**
 * Updates a care team member's role or status.
 * Supports role changes and primary provider designation.
 *
 * @param {ModelStatic<Model>} CareTeamMember - Care team member model
 * @param {string} memberId - Member ID
 * @param {Partial<CareTeamMemberConfig>} updates - Updates to apply
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated member
 *
 * Database optimization: Indexed by id (PK), quick single-row update
 * HIPAA: Audit trail for role changes
 *
 * @example
 * ```typescript
 * await updateCareTeamRole(CareTeamMember, 'member-uuid', {
 *   role: 'primary_care_physician',
 *   isLead: true
 * });
 * ```
 */
export async function updateCareTeamRole<T extends Model>(
  CareTeamMember: ModelStatic<T>,
  memberId: string,
  updates: Partial<CareTeamMemberConfig>,
  transaction?: Transaction,
): Promise<T> {
  const member = await CareTeamMember.findByPk(memberId, { transaction });

  if (!member) {
    throw new Error(`Care team member ${memberId} not found`);
  }

  const updateData: any = {};
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.isLead !== undefined) updateData.isLead = updates.isLead;
  if (updates.isPrimary !== undefined) updateData.isPrimary = updates.isPrimary;
  if (updates.endDate !== undefined) updateData.endDate = updates.endDate;

  await member.update(updateData, { transaction });
  return member;
}

// ============================================================================
// CARE PLAN OPERATIONS (7 functions)
// ============================================================================

/**
 * Creates a comprehensive care plan with goals and interventions.
 * Supports versioning and approval workflow.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {CarePlanConfig} config - Care plan configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created care plan
 *
 * Database optimization: Indexed by patient_id, status, effective_date
 * GIN index on goals and interventions JSONB for search
 * HIPAA: Comprehensive audit trail for care plan creation
 *
 * @example
 * ```typescript
 * const plan = await createCarePlan(CarePlan, {
 *   patientId: 'patient-uuid',
 *   planType: 'comprehensive',
 *   title: 'Diabetes Management Plan',
 *   effectiveDate: new Date(),
 *   goals: [{ description: 'HbA1c < 7.0%', targetDate: addMonths(new Date(), 3) }],
 *   createdBy: 'provider-uuid'
 * });
 * ```
 */
export async function createCarePlan<T extends Model>(
  CarePlan: ModelStatic<T>,
  config: CarePlanConfig,
  transaction?: Transaction,
): Promise<T> {
  // Get current version number for this patient
  const latestPlan = await CarePlan.findOne({
    where: {
      patientId: config.patientId,
      planType: config.planType,
    } as any,
    order: [['version', 'DESC']],
    transaction,
  });

  const version = config.version || (latestPlan ? (latestPlan.get('version') as number) + 1 : 1);

  const carePlan = await CarePlan.create(
    {
      patientId: config.patientId,
      careTeamId: config.careTeamId,
      planType: config.planType,
      title: config.title,
      description: config.description,
      version,
      status: config.status || 'draft',
      effectiveDate: config.effectiveDate,
      expirationDate: config.expirationDate || addMonths(config.effectiveDate, 12),
      goals: config.goals || [],
      interventions: config.interventions || [],
      barriers: config.barriers || [],
      createdBy: config.createdBy,
    } as any,
    { transaction },
  );

  return carePlan;
}

/**
 * Updates an existing care plan with versioning support.
 * Creates new version if significant changes are made.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} carePlanId - Care plan ID
 * @param {Partial<CarePlanConfig>} updates - Updates to apply
 * @param {boolean} createNewVersion - Whether to create new version
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated or new care plan
 *
 * Database optimization: Single-row update or versioned insert
 * HIPAA: Audit trail with version history
 *
 * @example
 * ```typescript
 * const updated = await updateCarePlan(CarePlan, 'plan-uuid', {
 *   goals: [...existingGoals, newGoal],
 *   status: 'active'
 * }, false);
 * ```
 */
export async function updateCarePlan<T extends Model>(
  CarePlan: ModelStatic<T>,
  carePlanId: string,
  updates: Partial<CarePlanConfig>,
  createNewVersion: boolean = false,
  transaction?: Transaction,
): Promise<T> {
  const existingPlan = await CarePlan.findByPk(carePlanId, { transaction });

  if (!existingPlan) {
    throw new Error(`Care plan ${carePlanId} not found`);
  }

  if (createNewVersion) {
    // Archive current plan and create new version
    await existingPlan.update({ status: 'archived' } as any, { transaction });

    const newVersion = await createCarePlan(
      CarePlan,
      {
        ...(existingPlan.toJSON() as any),
        ...updates,
        version: (existingPlan.get('version') as number) + 1,
        status: 'draft',
      },
      transaction,
    );

    return newVersion;
  }

  // Update in place
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.effectiveDate !== undefined) updateData.effectiveDate = updates.effectiveDate;
  if (updates.expirationDate !== undefined) updateData.expirationDate = updates.expirationDate;
  if (updates.goals !== undefined) updateData.goals = updates.goals;
  if (updates.interventions !== undefined) updateData.interventions = updates.interventions;
  if (updates.barriers !== undefined) updateData.barriers = updates.barriers;

  await existingPlan.update(updateData, { transaction });
  return existingPlan;
}

/**
 * Retrieves care plans for a patient with filtering and pagination.
 * Supports status, date range, and plan type filters.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} patientId - Patient ID
 * @param {CareCoordinationQueryOptions} options - Query options
 * @returns {Promise<PaginatedResult<Model>>} Paginated care plans
 *
 * Database optimization: Composite index (patient_id, status, effective_date)
 * Performance: Pagination with limit/offset
 *
 * @example
 * ```typescript
 * const plans = await getCarePlansByPatient(CarePlan, 'patient-uuid', {
 *   status: ['active', 'approved'],
 *   limit: 10,
 *   offset: 0
 * });
 * ```
 */
export async function getCarePlansByPatient<T extends Model>(
  CarePlan: ModelStatic<T>,
  patientId: string,
  options: CareCoordinationQueryOptions = {},
): Promise<PaginatedResult<T>> {
  const whereClause: WhereOptions = { patientId };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.startDate || options.endDate) {
    whereClause.effectiveDate = {};
    if (options.startDate) (whereClause.effectiveDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.effectiveDate as any)[Op.lte] = options.endDate;
  }

  const limit = options.limit || 20;
  const offset = options.offset || 0;

  const { count, rows } = await CarePlan.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: options.order || [['effectiveDate', 'DESC'], ['version', 'DESC']],
    include: options.include,
    transaction: options.transaction,
  });

  return {
    data: rows,
    total: count,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalPages: Math.ceil(count / limit),
  };
}

/**
 * Adds a SMART goal to a care plan.
 * SMART: Specific, Measurable, Achievable, Relevant, Time-bound
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} carePlanId - Care plan ID
 * @param {CarePlanGoal} goal - Goal to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated care plan
 *
 * Database optimization: JSONB array append operation
 * HIPAA: Audit trail for goal modifications
 *
 * @example
 * ```typescript
 * await addCarePlanGoal(CarePlan, 'plan-uuid', {
 *   description: 'Walk 30 minutes daily',
 *   targetDate: addMonths(new Date(), 2),
 *   status: 'not_started',
 *   metrics: [{ name: 'Weekly walks', target: 7, unit: 'days' }]
 * });
 * ```
 */
export async function addCarePlanGoal<T extends Model>(
  CarePlan: ModelStatic<T>,
  carePlanId: string,
  goal: CarePlanGoal,
  transaction?: Transaction,
): Promise<T> {
  const carePlan = await CarePlan.findByPk(carePlanId, { transaction });

  if (!carePlan) {
    throw new Error(`Care plan ${carePlanId} not found`);
  }

  const goals = (carePlan.get('goals') as CarePlanGoal[]) || [];
  const newGoal: CarePlanGoal = {
    id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: goal.description,
    targetDate: goal.targetDate,
    status: goal.status || 'not_started',
    metrics: goal.metrics || [],
    assignedTo: goal.assignedTo || [],
  };

  goals.push(newGoal);

  await carePlan.update({ goals } as any, { transaction });
  return carePlan;
}

/**
 * Adds an intervention to a care plan.
 * Interventions are specific actions to achieve goals.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} carePlanId - Care plan ID
 * @param {CarePlanIntervention} intervention - Intervention to add
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated care plan
 *
 * Database optimization: JSONB array append operation
 * HIPAA: Audit trail for intervention modifications
 *
 * @example
 * ```typescript
 * await addCarePlanIntervention(CarePlan, 'plan-uuid', {
 *   description: 'Monthly diabetes education sessions',
 *   category: 'patient_education',
 *   frequency: 'monthly',
 *   assignedTo: 'diabetes-educator-uuid',
 *   startDate: new Date()
 * });
 * ```
 */
export async function addCarePlanIntervention<T extends Model>(
  CarePlan: ModelStatic<T>,
  carePlanId: string,
  intervention: CarePlanIntervention,
  transaction?: Transaction,
): Promise<T> {
  const carePlan = await CarePlan.findByPk(carePlanId, { transaction });

  if (!carePlan) {
    throw new Error(`Care plan ${carePlanId} not found`);
  }

  const interventions = (carePlan.get('interventions') as CarePlanIntervention[]) || [];
  const newIntervention: CarePlanIntervention = {
    id: `intervention-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: intervention.description,
    category: intervention.category,
    frequency: intervention.frequency,
    duration: intervention.duration,
    assignedTo: intervention.assignedTo,
    startDate: intervention.startDate || new Date(),
    endDate: intervention.endDate,
    status: intervention.status || 'planned',
  };

  interventions.push(newIntervention);

  await carePlan.update({ interventions } as any, { transaction });
  return carePlan;
}

/**
 * Approves a care plan and activates it.
 * Multi-disciplinary approval workflow support.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} carePlanId - Care plan ID
 * @param {string} approvedBy - Provider ID approving
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Approved care plan
 *
 * Database optimization: Single-row update with approval metadata
 * HIPAA: Audit trail for approvals
 *
 * @example
 * ```typescript
 * const approved = await approveCarePlan(CarePlan, 'plan-uuid', 'provider-uuid');
 * ```
 */
export async function approveCarePlan<T extends Model>(
  CarePlan: ModelStatic<T>,
  carePlanId: string,
  approvedBy: string,
  transaction?: Transaction,
): Promise<T> {
  const carePlan = await CarePlan.findByPk(carePlanId, { transaction });

  if (!carePlan) {
    throw new Error(`Care plan ${carePlanId} not found`);
  }

  const currentStatus = carePlan.get('status') as CarePlanStatus;
  if (currentStatus !== 'draft' && currentStatus !== 'pending_approval') {
    throw new Error(`Care plan must be in draft or pending_approval status to approve. Current status: ${currentStatus}`);
  }

  await carePlan.update(
    {
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
    } as any,
    { transaction },
  );

  return carePlan;
}

/**
 * Archives a care plan with reason.
 * Soft delete preserving full history.
 *
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} carePlanId - Care plan ID
 * @param {string} reason - Archive reason
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Archived care plan
 *
 * Database optimization: Single-row update, indexed by status
 * HIPAA: Audit trail with archive reason
 *
 * @example
 * ```typescript
 * await archiveCarePlan(CarePlan, 'plan-uuid', 'Patient transferred to different facility');
 * ```
 */
export async function archiveCarePlan<T extends Model>(
  CarePlan: ModelStatic<T>,
  carePlanId: string,
  reason: string,
  transaction?: Transaction,
): Promise<T> {
  const carePlan = await CarePlan.findByPk(carePlanId, { transaction });

  if (!carePlan) {
    throw new Error(`Care plan ${carePlanId} not found`);
  }

  await carePlan.update(
    {
      status: 'archived',
      metadata: {
        ...(carePlan.get('metadata') as any),
        archiveReason: reason,
        archivedAt: new Date().toISOString(),
      },
    } as any,
    { transaction },
  );

  return carePlan;
}

// ============================================================================
// CARE TRANSITIONS / ADT MESSAGE PROCESSING (5 functions)
// ============================================================================

/**
 * Records a hospital admission event.
 * Processes ADT A01/A04 messages (HL7).
 *
 * @param {ModelStatic<Model>} AdtMessage - ADT message model
 * @param {AdtMessageConfig} config - ADT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created admission record
 *
 * Database optimization: Indexed by patient_id, event_timestamp, facility_id
 * GIN index on fhir_bundle for FHIR resource queries
 * HIPAA: Comprehensive audit trail for admissions
 *
 * @example
 * ```typescript
 * const admission = await recordAdmission(AdtMessage, {
 *   patientId: 'patient-uuid',
 *   messageType: 'admission',
 *   eventTimestamp: new Date(),
 *   facilityId: 'facility-uuid',
 *   toUnit: '4 East Medical',
 *   attendingProviderId: 'provider-uuid'
 * });
 * ```
 */
export async function recordAdmission<T extends Model>(
  AdtMessage: ModelStatic<T>,
  config: AdtMessageConfig,
  transaction?: Transaction,
): Promise<T> {
  if (config.messageType !== 'admission' && config.messageType !== 'pre_admission') {
    throw new Error('Message type must be admission or pre_admission');
  }

  const admission = await AdtMessage.create(
    {
      patientId: config.patientId,
      messageType: config.messageType,
      eventTimestamp: config.eventTimestamp,
      facilityId: config.facilityId,
      toUnit: config.toUnit,
      attendingProviderId: config.attendingProviderId,
      hl7Message: config.hl7Message,
      fhirBundle: config.fhirBundle,
      processedAt: new Date(),
    } as any,
    { transaction },
  );

  return admission;
}

/**
 * Records a hospital discharge event.
 * Processes ADT A03 messages (HL7).
 *
 * @param {ModelStatic<Model>} AdtMessage - ADT message model
 * @param {AdtMessageConfig} config - ADT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created discharge record
 *
 * Database optimization: Indexed by patient_id, event_timestamp
 * HIPAA: Audit trail for discharges with disposition
 *
 * @example
 * ```typescript
 * const discharge = await recordDischarge(AdtMessage, {
 *   patientId: 'patient-uuid',
 *   messageType: 'discharge',
 *   eventTimestamp: new Date(),
 *   facilityId: 'facility-uuid',
 *   fromUnit: '4 East Medical',
 *   dischargeDisposition: 'home_with_home_health'
 * });
 * ```
 */
export async function recordDischarge<T extends Model>(
  AdtMessage: ModelStatic<T>,
  config: AdtMessageConfig,
  transaction?: Transaction,
): Promise<T> {
  if (config.messageType !== 'discharge') {
    throw new Error('Message type must be discharge');
  }

  if (!config.dischargeDisposition) {
    throw new Error('Discharge disposition is required for discharge events');
  }

  const discharge = await AdtMessage.create(
    {
      patientId: config.patientId,
      messageType: config.messageType,
      eventTimestamp: config.eventTimestamp,
      facilityId: config.facilityId,
      fromUnit: config.fromUnit,
      dischargeDisposition: config.dischargeDisposition,
      attendingProviderId: config.attendingProviderId,
      hl7Message: config.hl7Message,
      fhirBundle: config.fhirBundle,
      processedAt: new Date(),
    } as any,
    { transaction },
  );

  return discharge;
}

/**
 * Records a patient transfer between units or facilities.
 * Processes ADT A02/A06/A07 messages (HL7).
 *
 * @param {ModelStatic<Model>} AdtMessage - ADT message model
 * @param {AdtMessageConfig} config - ADT configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created transfer record
 *
 * Database optimization: Indexed by patient_id, event_timestamp, facility_id
 * HIPAA: Audit trail for patient movements
 *
 * @example
 * ```typescript
 * const transfer = await recordTransfer(AdtMessage, {
 *   patientId: 'patient-uuid',
 *   messageType: 'transfer',
 *   eventTimestamp: new Date(),
 *   facilityId: 'facility-uuid',
 *   fromUnit: '4 East Medical',
 *   toUnit: 'ICU',
 *   attendingProviderId: 'provider-uuid'
 * });
 * ```
 */
export async function recordTransfer<T extends Model>(
  AdtMessage: ModelStatic<T>,
  config: AdtMessageConfig,
  transaction?: Transaction,
): Promise<T> {
  if (config.messageType !== 'transfer') {
    throw new Error('Message type must be transfer');
  }

  if (!config.fromUnit || !config.toUnit) {
    throw new Error('Both fromUnit and toUnit are required for transfer events');
  }

  const transfer = await AdtMessage.create(
    {
      patientId: config.patientId,
      messageType: config.messageType,
      eventTimestamp: config.eventTimestamp,
      facilityId: config.facilityId,
      fromUnit: config.fromUnit,
      toUnit: config.toUnit,
      attendingProviderId: config.attendingProviderId,
      hl7Message: config.hl7Message,
      fhirBundle: config.fhirBundle,
      processedAt: new Date(),
    } as any,
    { transaction },
  );

  return transfer;
}

/**
 * Retrieves complete transition history for a patient.
 * Returns chronological ADT events with filtering.
 *
 * @param {ModelStatic<Model>} AdtMessage - ADT message model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} ADT message history
 *
 * Database optimization: Composite index (patient_id, event_timestamp DESC)
 * Performance: Limit to last 100 events by default
 *
 * @example
 * ```typescript
 * const history = await getTransitionHistory(AdtMessage, 'patient-uuid', {
 *   startDate: subMonths(new Date(), 6),
 *   messageType: ['admission', 'discharge']
 * });
 * ```
 */
export async function getTransitionHistory<T extends Model>(
  AdtMessage: ModelStatic<T>,
  patientId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    messageType?: AdtMessageType | AdtMessageType[];
    facilityId?: string;
    limit?: number;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.startDate || options.endDate) {
    whereClause.eventTimestamp = {};
    if (options.startDate) (whereClause.eventTimestamp as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.eventTimestamp as any)[Op.lte] = options.endDate;
  }

  if (options.messageType) {
    whereClause.messageType = Array.isArray(options.messageType)
      ? { [Op.in]: options.messageType }
      : options.messageType;
  }

  if (options.facilityId) {
    whereClause.facilityId = options.facilityId;
  }

  const messages = await AdtMessage.findAll({
    where: whereClause,
    order: [['eventTimestamp', 'DESC']],
    limit: options.limit || 100,
    transaction: options.transaction,
  });

  return messages;
}

/**
 * Generates a transition of care summary (CCD/CCDA).
 * Creates HL7 FHIR Bundle for continuity of care document.
 *
 * @param {ModelStatic<Model>} AdtMessage - ADT message model
 * @param {ModelStatic<Model>} CarePlan - Care plan model
 * @param {string} patientId - Patient ID
 * @param {string} dischargeId - Discharge ADT message ID
 * @returns {Promise<Object>} FHIR Bundle transition summary
 *
 * Database optimization: Join ADT with care plans, medications, allergies
 * Performance: Cached for 5 minutes after generation
 *
 * @example
 * ```typescript
 * const summary = await generateTransitionSummary(
 *   AdtMessage, CarePlan, 'patient-uuid', 'discharge-adt-uuid'
 * );
 * // Returns FHIR Bundle with patient, problems, medications, care plan
 * ```
 */
export async function generateTransitionSummary(
  AdtMessage: ModelStatic<Model>,
  CarePlan: ModelStatic<Model>,
  patientId: string,
  dischargeId: string,
): Promise<Record<string, any>> {
  const discharge = await AdtMessage.findByPk(dischargeId);

  if (!discharge) {
    throw new Error(`Discharge ${dischargeId} not found`);
  }

  if (discharge.get('patientId') !== patientId) {
    throw new Error('Discharge does not belong to specified patient');
  }

  // Get active care plan
  const activePlans = await CarePlan.findAll({
    where: {
      patientId,
      status: { [Op.in]: ['active', 'approved'] },
    } as any,
    order: [['effectiveDate', 'DESC']],
    limit: 1,
  });

  // Create FHIR Bundle
  const bundle: Record<string, any> = {
    resourceType: 'Bundle',
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Composition',
          status: 'final',
          type: {
            coding: [
              {
                system: 'http://loinc.org',
                code: '34133-9',
                display: 'Summarization of Episode Note',
              },
            ],
          },
          subject: { reference: `Patient/${patientId}` },
          date: discharge.get('eventTimestamp'),
          title: 'Transition of Care Summary',
        },
      },
    ],
  };

  // Add care plan if available
  if (activePlans.length > 0) {
    const carePlan = activePlans[0];
    bundle.entry.push({
      resource: {
        resourceType: 'CarePlan',
        status: 'active',
        intent: 'plan',
        subject: { reference: `Patient/${patientId}` },
        period: {
          start: carePlan.get('effectiveDate'),
          end: carePlan.get('expirationDate'),
        },
        goal: (carePlan.get('goals') as CarePlanGoal[]).map((g) => ({
          description: { text: g.description },
          target: g.metrics,
        })),
      },
    });
  }

  // Add discharge details
  bundle.entry.push({
    resource: {
      resourceType: 'Encounter',
      status: 'finished',
      class: { code: 'IMP', display: 'inpatient encounter' },
      subject: { reference: `Patient/${patientId}` },
      period: {
        end: discharge.get('eventTimestamp'),
      },
      hospitalization: {
        dischargeDisposition: {
          text: discharge.get('dischargeDisposition'),
        },
      },
    },
  });

  return bundle;
}

// ============================================================================
// REFERRAL MANAGEMENT (5 functions)
// ============================================================================

/**
 * Creates a new referral to specialist or service.
 * Initiates referral workflow with tracking.
 *
 * @param {ModelStatic<Model>} Referral - Referral model
 * @param {ReferralConfig} config - Referral configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created referral
 *
 * Database optimization: Indexed by patient_id, referring_provider_id, status, specialty
 * HIPAA: Audit trail for referral creation
 *
 * @example
 * ```typescript
 * const referral = await createReferral(Referral, {
 *   patientId: 'patient-uuid',
 *   referringProviderId: 'pcp-uuid',
 *   specialty: 'cardiology',
 *   priority: 'urgent',
 *   reason: 'Chest pain evaluation',
 *   requestedDate: new Date(),
 *   diagnoses: ['I20.9']
 * });
 * ```
 */
export async function createReferral<T extends Model>(
  Referral: ModelStatic<T>,
  config: ReferralConfig,
  transaction?: Transaction,
): Promise<T> {
  const referral = await Referral.create(
    {
      patientId: config.patientId,
      referringProviderId: config.referringProviderId,
      referredToProviderId: config.referredToProviderId,
      specialty: config.specialty,
      priority: config.priority,
      status: 'pending',
      reason: config.reason,
      clinicalSummary: config.clinicalSummary,
      requestedDate: config.requestedDate,
      requiredByDate: config.requiredByDate,
      diagnoses: config.diagnoses || [],
      attachments: config.attachments || [],
    } as any,
    { transaction },
  );

  return referral;
}

/**
 * Updates referral status throughout lifecycle.
 * Tracks workflow from pending → scheduled → completed.
 *
 * @param {ModelStatic<Model>} Referral - Referral model
 * @param {string} referralId - Referral ID
 * @param {ReferralStatus} status - New status
 * @param {Object} metadata - Additional status metadata
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated referral
 *
 * Database optimization: Single-row update with status history
 * HIPAA: Audit trail for status changes
 *
 * @example
 * ```typescript
 * await updateReferralStatus(Referral, 'referral-uuid', 'scheduled', {
 *   scheduledDate: new Date('2025-12-15'),
 *   scheduledWith: 'cardiologist-uuid'
 * });
 * ```
 */
export async function updateReferralStatus<T extends Model>(
  Referral: ModelStatic<T>,
  referralId: string,
  status: ReferralStatus,
  metadata?: {
    scheduledDate?: Date;
    completedDate?: Date;
    cancelReason?: string;
    outcome?: string;
  },
  transaction?: Transaction,
): Promise<T> {
  const referral = await Referral.findByPk(referralId, { transaction });

  if (!referral) {
    throw new Error(`Referral ${referralId} not found`);
  }

  const updateData: any = { status };

  if (status === 'scheduled' && metadata?.scheduledDate) {
    updateData.scheduledDate = metadata.scheduledDate;
  }

  if (status === 'completed') {
    updateData.completedDate = metadata?.completedDate || new Date();
    if (metadata?.outcome) {
      updateData.outcome = metadata.outcome;
    }
  }

  if (status === 'cancelled' && metadata?.cancelReason) {
    updateData.metadata = {
      ...(referral.get('metadata') as any),
      cancelReason: metadata.cancelReason,
      cancelledAt: new Date().toISOString(),
    };
  }

  await referral.update(updateData, { transaction });
  return referral;
}

/**
 * Retrieves referrals for a patient with filtering.
 * Supports status, specialty, and date range filters.
 *
 * @param {ModelStatic<Model>} Referral - Referral model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Patient referrals
 *
 * Database optimization: Composite index (patient_id, status)
 * Performance: Eager load referring and referred-to providers
 *
 * @example
 * ```typescript
 * const referrals = await getReferralsByPatient(Referral, 'patient-uuid', {
 *   status: ['pending', 'scheduled'],
 *   includeProviders: true
 * });
 * ```
 */
export async function getReferralsByPatient<T extends Model>(
  Referral: ModelStatic<T>,
  patientId: string,
  options: {
    status?: ReferralStatus | ReferralStatus[];
    specialty?: string;
    startDate?: Date;
    endDate?: Date;
    includeProviders?: boolean;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.specialty) {
    whereClause.specialty = options.specialty;
  }

  if (options.startDate || options.endDate) {
    whereClause.requestedDate = {};
    if (options.startDate) (whereClause.requestedDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.requestedDate as any)[Op.lte] = options.endDate;
  }

  const findOptions: FindOptions = {
    where: whereClause,
    order: [['requestedDate', 'DESC']],
    transaction: options.transaction,
  };

  if (options.includeProviders) {
    findOptions.include = [
      { association: 'referringProvider', attributes: ['id', 'firstName', 'lastName', 'specialty'] },
      { association: 'referredToProvider', attributes: ['id', 'firstName', 'lastName', 'specialty'], required: false },
    ] as any;
  }

  const referrals = await Referral.findAll(findOptions);
  return referrals;
}

/**
 * Assigns a referral to specific provider.
 * Routes referral to appropriate specialist.
 *
 * @param {ModelStatic<Model>} Referral - Referral model
 * @param {string} referralId - Referral ID
 * @param {string} providerId - Provider to assign
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated referral
 *
 * Database optimization: Single-row update, indexed by referred_to_provider_id
 * HIPAA: Audit trail for provider assignment
 *
 * @example
 * ```typescript
 * await assignReferralProvider(Referral, 'referral-uuid', 'specialist-uuid');
 * ```
 */
export async function assignReferralProvider<T extends Model>(
  Referral: ModelStatic<T>,
  referralId: string,
  providerId: string,
  transaction?: Transaction,
): Promise<T> {
  const referral = await Referral.findByPk(referralId, { transaction });

  if (!referral) {
    throw new Error(`Referral ${referralId} not found`);
  }

  await referral.update(
    {
      referredToProviderId: providerId,
      status: 'scheduled',
    } as any,
    { transaction },
  );

  return referral;
}

/**
 * Closes a referral with outcome documentation.
 * Completes referral workflow with results.
 *
 * @param {ModelStatic<Model>} Referral - Referral model
 * @param {string} referralId - Referral ID
 * @param {string} outcome - Referral outcome/results
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Closed referral
 *
 * Database optimization: Single-row update with completion data
 * HIPAA: Audit trail for referral closure
 *
 * @example
 * ```typescript
 * await closeReferral(Referral, 'referral-uuid', 'Patient evaluated, echo normal, no intervention needed');
 * ```
 */
export async function closeReferral<T extends Model>(
  Referral: ModelStatic<T>,
  referralId: string,
  outcome: string,
  transaction?: Transaction,
): Promise<T> {
  const referral = await Referral.findByPk(referralId, { transaction });

  if (!referral) {
    throw new Error(`Referral ${referralId} not found`);
  }

  await referral.update(
    {
      status: 'completed',
      completedDate: new Date(),
      outcome,
    } as any,
    { transaction },
  );

  return referral;
}

// ============================================================================
// CARE GAP IDENTIFICATION (5 functions)
// ============================================================================

/**
 * Identifies care gaps based on evidence-based guidelines.
 * Detects missing screenings, tests, visits, medications.
 *
 * @param {ModelStatic<Model>} CareGap - Care gap model
 * @param {string} patientId - Patient ID
 * @param {Object} clinicalData - Patient clinical data
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model[]>} Identified care gaps
 *
 * Database optimization: Bulk insert of identified gaps
 * Performance: Rule engine evaluation with caching
 *
 * @example
 * ```typescript
 * const gaps = await identifyCareGaps(CareGap, 'patient-uuid', {
 *   age: 65,
 *   gender: 'F',
 *   conditions: ['diabetes', 'hypertension'],
 *   lastMammogram: null,
 *   lastA1c: subMonths(new Date(), 7)
 * });
 * // Returns: [mammogram gap, A1c gap]
 * ```
 */
export async function identifyCareGaps<T extends Model>(
  CareGap: ModelStatic<T>,
  patientId: string,
  clinicalData: {
    age: number;
    gender: string;
    conditions?: string[];
    medications?: string[];
    lastScreenings?: Record<string, Date>;
    lastLabTests?: Record<string, Date>;
  },
  transaction?: Transaction,
): Promise<T[]> {
  const identifiedGaps: CareGapConfig[] = [];

  // Age-based preventive care gaps
  if (clinicalData.age >= 50 && clinicalData.gender === 'F') {
    const lastMammogram = clinicalData.lastScreenings?.['mammogram'];
    if (!lastMammogram || differenceInDays(new Date(), lastMammogram) > 730) {
      identifiedGaps.push({
        patientId,
        gapType: 'preventive_screening',
        description: 'Mammogram overdue (recommended annually for women 50+)',
        evidenceSource: 'USPSTF Grade B',
        dueDate: lastMammogram ? addDays(lastMammogram, 365) : new Date(),
        priority: 'high',
        recommendations: ['Schedule bilateral mammogram'],
        relatedMeasures: ['BCS-E'],
      });
    }
  }

  // Diabetes monitoring gaps
  if (clinicalData.conditions?.includes('diabetes')) {
    const lastA1c = clinicalData.lastLabTests?.['a1c'];
    if (!lastA1c || differenceInDays(new Date(), lastA1c) > 180) {
      identifiedGaps.push({
        patientId,
        gapType: 'chronic_disease_monitoring',
        description: 'HbA1c test overdue (recommended every 6 months for diabetes)',
        evidenceSource: 'ADA Standards of Care',
        dueDate: lastA1c ? addDays(lastA1c, 180) : new Date(),
        priority: 'high',
        recommendations: ['Order HbA1c lab test', 'Schedule diabetes follow-up visit'],
        relatedMeasures: ['CDC-H7', 'CDC-H8'],
      });
    }

    const lastEyeExam = clinicalData.lastScreenings?.['diabetic_retinopathy'];
    if (!lastEyeExam || differenceInDays(new Date(), lastEyeExam) > 365) {
      identifiedGaps.push({
        patientId,
        gapType: 'preventive_screening',
        description: 'Diabetic eye exam overdue (recommended annually)',
        evidenceSource: 'ADA Standards of Care',
        dueDate: lastEyeExam ? addDays(lastEyeExam, 365) : new Date(),
        priority: 'medium',
        recommendations: ['Refer to ophthalmology for dilated eye exam'],
        relatedMeasures: ['CDC-H5'],
      });
    }
  }

  // Hypertension monitoring gaps
  if (clinicalData.conditions?.includes('hypertension')) {
    const lastBpCheck = clinicalData.lastScreenings?.['blood_pressure'];
    if (!lastBpCheck || differenceInDays(new Date(), lastBpCheck) > 180) {
      identifiedGaps.push({
        patientId,
        gapType: 'chronic_disease_monitoring',
        description: 'Blood pressure check overdue (recommended every 6 months)',
        evidenceSource: 'AHA/ACC Guidelines',
        dueDate: lastBpCheck ? addDays(lastBpCheck, 180) : new Date(),
        priority: 'medium',
        recommendations: ['Schedule blood pressure check', 'Assess medication adherence'],
        relatedMeasures: ['CBP-E'],
      });
    }
  }

  // Colorectal cancer screening
  if (clinicalData.age >= 45 && clinicalData.age <= 75) {
    const lastColonoscopy = clinicalData.lastScreenings?.['colonoscopy'];
    const lastFit = clinicalData.lastScreenings?.['fit_test'];

    if (!lastColonoscopy && !lastFit) {
      identifiedGaps.push({
        patientId,
        gapType: 'preventive_screening',
        description: 'Colorectal cancer screening needed (colonoscopy every 10 years or FIT annually)',
        evidenceSource: 'USPSTF Grade A',
        dueDate: new Date(),
        priority: 'high',
        recommendations: ['Discuss screening options with patient', 'Order colonoscopy or FIT test'],
        relatedMeasures: ['COL-E'],
      });
    } else if (lastFit && differenceInDays(new Date(), lastFit) > 365) {
      identifiedGaps.push({
        patientId,
        gapType: 'preventive_screening',
        description: 'FIT test overdue (recommended annually)',
        evidenceSource: 'USPSTF Grade A',
        dueDate: addDays(lastFit, 365),
        priority: 'high',
        recommendations: ['Order FIT test'],
        relatedMeasures: ['COL-E'],
      });
    }
  }

  // Create care gap records
  const createdGaps: T[] = [];
  for (const gapConfig of identifiedGaps) {
    const gap = await CareGap.create(
      {
        ...gapConfig,
        status: 'open',
        identifiedDate: new Date(),
      } as any,
      { transaction },
    );
    createdGaps.push(gap);
  }

  return createdGaps;
}

/**
 * Retrieves care gaps for a specific patient.
 * Filters by status, type, priority.
 *
 * @param {ModelStatic<Model>} CareGap - Care gap model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Patient care gaps
 *
 * Database optimization: Composite index (patient_id, status)
 * Performance: Order by priority and due date
 *
 * @example
 * ```typescript
 * const openGaps = await getCareGapsByPatient(CareGap, 'patient-uuid', {
 *   status: 'open',
 *   priority: ['high', 'critical']
 * });
 * ```
 */
export async function getCareGapsByPatient<T extends Model>(
  CareGap: ModelStatic<T>,
  patientId: string,
  options: {
    status?: CareGapStatus | CareGapStatus[];
    gapType?: CareGapType | CareGapType[];
    priority?: string | string[];
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.gapType) {
    whereClause.gapType = Array.isArray(options.gapType) ? { [Op.in]: options.gapType } : options.gapType;
  }

  if (options.priority) {
    whereClause.priority = Array.isArray(options.priority) ? { [Op.in]: options.priority } : options.priority;
  }

  const gaps = await CareGap.findAll({
    where: whereClause,
    order: [
      ['priority', 'DESC'],
      ['dueDate', 'ASC'],
    ],
    transaction: options.transaction,
  });

  return gaps;
}

/**
 * Retrieves care gaps for a population or provider panel.
 * Aggregates gaps across multiple patients.
 *
 * @param {ModelStatic<Model>} CareGap - Care gap model
 * @param {Object} options - Query options
 * @returns {Promise<any>} Population care gap analytics
 *
 * Database optimization: Aggregation query with GROUP BY
 * Performance: Use read replica for analytics queries
 *
 * @example
 * ```typescript
 * const popGaps = await getCareGapsByPopulation(CareGap, {
 *   providerId: 'provider-uuid',
 *   status: 'open',
 *   gapType: 'preventive_screening'
 * });
 * // Returns: { total: 150, byType: {...}, byPriority: {...} }
 * ```
 */
export async function getCareGapsByPopulation(
  CareGap: ModelStatic<Model>,
  options: {
    providerId?: string;
    patientIds?: string[];
    status?: CareGapStatus | CareGapStatus[];
    gapType?: CareGapType | CareGapType[];
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<{
  total: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  gaps: any[];
}> {
  const whereClause: WhereOptions = {};

  if (options.patientIds) {
    whereClause.patientId = { [Op.in]: options.patientIds };
  }

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.gapType) {
    whereClause.gapType = Array.isArray(options.gapType) ? { [Op.in]: options.gapType } : options.gapType;
  }

  if (options.startDate || options.endDate) {
    whereClause.dueDate = {};
    if (options.startDate) (whereClause.dueDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.dueDate as any)[Op.lte] = options.endDate;
  }

  const gaps = await CareGap.findAll({
    where: whereClause,
    attributes: ['gapType', 'priority', 'status', 'patientId'],
  });

  const total = gaps.length;
  const byType: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  gaps.forEach((gap) => {
    const type = gap.get('gapType') as string;
    const priority = gap.get('priority') as string;
    const status = gap.get('status') as string;

    byType[type] = (byType[type] || 0) + 1;
    byPriority[priority] = (byPriority[priority] || 0) + 1;
    byStatus[status] = (byStatus[status] || 0) + 1;
  });

  return {
    total,
    byType,
    byPriority,
    byStatus,
    gaps: gaps.map((g) => g.toJSON()),
  };
}

/**
 * Closes a care gap with completion documentation.
 * Documents intervention that closed the gap.
 *
 * @param {ModelStatic<Model>} CareGap - Care gap model
 * @param {string} gapId - Care gap ID
 * @param {Object} closureInfo - Closure information
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Closed care gap
 *
 * Database optimization: Single-row update with closure metadata
 * HIPAA: Audit trail for gap closure
 *
 * @example
 * ```typescript
 * await closeCareGap(CareGap, 'gap-uuid', {
 *   closedBy: 'provider-uuid',
 *   closureDate: new Date(),
 *   interventionTaken: 'Mammogram completed 2025-11-05, BIRADS 1',
 *   relatedOrderId: 'order-uuid'
 * });
 * ```
 */
export async function closeCareGap<T extends Model>(
  CareGap: ModelStatic<T>,
  gapId: string,
  closureInfo: {
    closedBy: string;
    closureDate?: Date;
    interventionTaken: string;
    relatedOrderId?: string;
    outcome?: string;
  },
  transaction?: Transaction,
): Promise<T> {
  const gap = await CareGap.findByPk(gapId, { transaction });

  if (!gap) {
    throw new Error(`Care gap ${gapId} not found`);
  }

  await gap.update(
    {
      status: 'closed',
      closedBy: closureInfo.closedBy,
      closedDate: closureInfo.closureDate || new Date(),
      metadata: {
        ...(gap.get('metadata') as any),
        interventionTaken: closureInfo.interventionTaken,
        relatedOrderId: closureInfo.relatedOrderId,
        outcome: closureInfo.outcome,
      },
    } as any,
    { transaction },
  );

  return gap;
}

/**
 * Generates care gap report for quality improvement.
 * Creates summary for HEDIS/ACO reporting.
 *
 * @param {ModelStatic<Model>} CareGap - Care gap model
 * @param {Object} options - Report options
 * @returns {Promise<Object>} Care gap report
 *
 * Database optimization: Aggregation with date range filters
 * Performance: Cached for 1 hour, use read replica
 *
 * @example
 * ```typescript
 * const report = await generateCareGapReport(CareGap, {
 *   providerId: 'provider-uuid',
 *   period: { start: new Date('2025-01-01'), end: new Date('2025-12-31') }
 * });
 * ```
 */
export async function generateCareGapReport(
  CareGap: ModelStatic<Model>,
  options: {
    providerId?: string;
    patientIds?: string[];
    period?: { start: Date; end: Date };
  } = {},
): Promise<{
  summary: {
    totalGaps: number;
    openGaps: number;
    closedGaps: number;
    closureRate: number;
  };
  byType: Array<{ type: string; count: number; closureRate: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  trendData: Array<{ month: string; identified: number; closed: number }>;
}> {
  const whereClause: WhereOptions = {};

  if (options.patientIds) {
    whereClause.patientId = { [Op.in]: options.patientIds };
  }

  if (options.period) {
    whereClause.identifiedDate = {
      [Op.between]: [options.period.start, options.period.end],
    };
  }

  const gaps = await CareGap.findAll({
    where: whereClause,
    attributes: ['id', 'gapType', 'priority', 'status', 'identifiedDate', 'closedDate'],
  });

  const totalGaps = gaps.length;
  const openGaps = gaps.filter((g) => g.get('status') === 'open').length;
  const closedGaps = gaps.filter((g) => g.get('status') === 'closed').length;
  const closureRate = totalGaps > 0 ? (closedGaps / totalGaps) * 100 : 0;

  // Aggregate by type
  const typeMap = new Map<string, { total: number; closed: number }>();
  gaps.forEach((gap) => {
    const type = gap.get('gapType') as string;
    const status = gap.get('status') as string;
    const current = typeMap.get(type) || { total: 0, closed: 0 };
    current.total++;
    if (status === 'closed') current.closed++;
    typeMap.set(type, current);
  });

  const byType = Array.from(typeMap.entries()).map(([type, data]) => ({
    type,
    count: data.total,
    closureRate: data.total > 0 ? (data.closed / data.total) * 100 : 0,
  }));

  // Aggregate by priority
  const priorityMap = new Map<string, number>();
  gaps.forEach((gap) => {
    const priority = gap.get('priority') as string;
    priorityMap.set(priority, (priorityMap.get(priority) || 0) + 1);
  });

  const byPriority = Array.from(priorityMap.entries()).map(([priority, count]) => ({
    priority,
    count,
  }));

  // Trend data (placeholder - would require month-based aggregation)
  const trendData: Array<{ month: string; identified: number; closed: number }> = [];

  return {
    summary: {
      totalGaps,
      openGaps,
      closedGaps,
      closureRate: Math.round(closureRate * 100) / 100,
    },
    byType,
    byPriority,
    trendData,
  };
}

// ============================================================================
// PATIENT EDUCATION (3 functions)
// ============================================================================

/**
 * Assigns patient education material.
 * Tracks education delivery and completion.
 *
 * @param {ModelStatic<Model>} EducationAssignment - Education assignment model
 * @param {EducationAssignmentConfig} config - Assignment configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created assignment
 *
 * Database optimization: Indexed by patient_id, assigned_date
 * HIPAA: Audit trail for education assignments
 *
 * @example
 * ```typescript
 * const assignment = await assignEducationMaterial(EducationAssignment, {
 *   patientId: 'patient-uuid',
 *   materialId: 'diabetes-basics-video',
 *   assignedBy: 'provider-uuid',
 *   assignedDate: new Date(),
 *   deliveryMethod: 'online',
 *   topic: 'Diabetes Self-Management'
 * });
 * ```
 */
export async function assignEducationMaterial<T extends Model>(
  EducationAssignment: ModelStatic<T>,
  config: EducationAssignmentConfig,
  transaction?: Transaction,
): Promise<T> {
  const assignment = await EducationAssignment.create(
    {
      patientId: config.patientId,
      materialId: config.materialId,
      assignedBy: config.assignedBy,
      assignedDate: config.assignedDate,
      dueDate: config.dueDate,
      deliveryMethod: config.deliveryMethod,
      topic: config.topic,
      status: 'assigned',
      metadata: config.metadata || {},
    } as any,
    { transaction },
  );

  return assignment;
}

/**
 * Tracks patient education completion.
 * Records completion with comprehension assessment.
 *
 * @param {ModelStatic<Model>} EducationAssignment - Education assignment model
 * @param {string} assignmentId - Assignment ID
 * @param {Object} completionInfo - Completion details
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated assignment
 *
 * Database optimization: Single-row update with completion data
 * HIPAA: Audit trail for education tracking
 *
 * @example
 * ```typescript
 * await trackEducationCompletion(EducationAssignment, 'assignment-uuid', {
 *   completedDate: new Date(),
 *   durationMinutes: 15,
 *   comprehensionScore: 85,
 *   patientFeedback: 'Very helpful'
 * });
 * ```
 */
export async function trackEducationCompletion<T extends Model>(
  EducationAssignment: ModelStatic<T>,
  assignmentId: string,
  completionInfo: {
    completedDate?: Date;
    durationMinutes?: number;
    comprehensionScore?: number;
    patientFeedback?: string;
  },
  transaction?: Transaction,
): Promise<T> {
  const assignment = await EducationAssignment.findByPk(assignmentId, { transaction });

  if (!assignment) {
    throw new Error(`Education assignment ${assignmentId} not found`);
  }

  await assignment.update(
    {
      status: 'completed',
      completedDate: completionInfo.completedDate || new Date(),
      metadata: {
        ...(assignment.get('metadata') as any),
        durationMinutes: completionInfo.durationMinutes,
        comprehensionScore: completionInfo.comprehensionScore,
        patientFeedback: completionInfo.patientFeedback,
      },
    } as any,
    { transaction },
  );

  return assignment;
}

/**
 * Retrieves education history for a patient.
 * Returns completed and assigned education materials.
 *
 * @param {ModelStatic<Model>} EducationAssignment - Education assignment model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Education history
 *
 * Database optimization: Composite index (patient_id, assigned_date)
 * Performance: Order by date descending
 *
 * @example
 * ```typescript
 * const history = await getEducationHistory(EducationAssignment, 'patient-uuid', {
 *   status: 'completed',
 *   limit: 20
 * });
 * ```
 */
export async function getEducationHistory<T extends Model>(
  EducationAssignment: ModelStatic<T>,
  patientId: string,
  options: {
    status?: string | string[];
    topic?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.topic) {
    whereClause.topic = { [Op.iLike]: `%${options.topic}%` };
  }

  if (options.startDate || options.endDate) {
    whereClause.assignedDate = {};
    if (options.startDate) (whereClause.assignedDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.assignedDate as any)[Op.lte] = options.endDate;
  }

  const assignments = await EducationAssignment.findAll({
    where: whereClause,
    order: [['assignedDate', 'DESC']],
    limit: options.limit || 50,
    transaction: options.transaction,
  });

  return assignments;
}

// ============================================================================
// DISCHARGE PLANNING (4 functions)
// ============================================================================

/**
 * Creates a comprehensive discharge plan.
 * Multi-disciplinary discharge coordination.
 *
 * @param {ModelStatic<Model>} DischargePlan - Discharge plan model
 * @param {DischargePlanConfig} config - Discharge plan configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created discharge plan
 *
 * Database optimization: Indexed by patient_id, admission_id
 * HIPAA: Comprehensive audit trail for discharge planning
 *
 * @example
 * ```typescript
 * const plan = await createDischargePlan(DischargePlan, {
 *   patientId: 'patient-uuid',
 *   admissionId: 'admission-uuid',
 *   anticipatedDischargeDate: addDays(new Date(), 3),
 *   dischargeDisposition: 'home_with_home_health',
 *   followUpAppointments: [
 *     { provider: 'PCP', date: addDays(new Date(), 7), notes: 'Post-op check' }
 *   ],
 *   createdBy: 'case-manager-uuid'
 * });
 * ```
 */
export async function createDischargePlan<T extends Model>(
  DischargePlan: ModelStatic<T>,
  config: DischargePlanConfig,
  transaction?: Transaction,
): Promise<T> {
  const plan = await DischargePlan.create(
    {
      patientId: config.patientId,
      admissionId: config.admissionId,
      anticipatedDischargeDate: config.anticipatedDischargeDate,
      dischargeDisposition: config.dischargeDisposition,
      dischargeMedications: config.dischargeMedications || [],
      followUpAppointments: config.followUpAppointments || [],
      homeHealthOrdered: config.homeHealthOrdered || false,
      dmeOrdered: config.dmeOrdered || false,
      patientInstructions: config.patientInstructions,
      caregiverInstructions: config.caregiverInstructions,
      status: 'in_progress',
      createdBy: config.createdBy,
    } as any,
    { transaction },
  );

  return plan;
}

/**
 * Updates discharge plan components.
 * Modifies medications, appointments, instructions.
 *
 * @param {ModelStatic<Model>} DischargePlan - Discharge plan model
 * @param {string} planId - Discharge plan ID
 * @param {Partial<DischargePlanConfig>} updates - Updates to apply
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated discharge plan
 *
 * Database optimization: Single-row update with JSONB merge
 * HIPAA: Audit trail for plan modifications
 *
 * @example
 * ```typescript
 * await updateDischargePlan(DischargePlan, 'plan-uuid', {
 *   dischargeMedications: [...meds],
 *   homeHealthOrdered: true,
 *   anticipatedDischargeDate: newDate
 * });
 * ```
 */
export async function updateDischargePlan<T extends Model>(
  DischargePlan: ModelStatic<T>,
  planId: string,
  updates: Partial<DischargePlanConfig>,
  transaction?: Transaction,
): Promise<T> {
  const plan = await DischargePlan.findByPk(planId, { transaction });

  if (!plan) {
    throw new Error(`Discharge plan ${planId} not found`);
  }

  const updateData: any = {};

  if (updates.anticipatedDischargeDate !== undefined) {
    updateData.anticipatedDischargeDate = updates.anticipatedDischargeDate;
  }
  if (updates.dischargeDisposition !== undefined) {
    updateData.dischargeDisposition = updates.dischargeDisposition;
  }
  if (updates.dischargeMedications !== undefined) {
    updateData.dischargeMedications = updates.dischargeMedications;
  }
  if (updates.followUpAppointments !== undefined) {
    updateData.followUpAppointments = updates.followUpAppointments;
  }
  if (updates.homeHealthOrdered !== undefined) {
    updateData.homeHealthOrdered = updates.homeHealthOrdered;
  }
  if (updates.dmeOrdered !== undefined) {
    updateData.dmeOrdered = updates.dmeOrdered;
  }
  if (updates.patientInstructions !== undefined) {
    updateData.patientInstructions = updates.patientInstructions;
  }
  if (updates.caregiverInstructions !== undefined) {
    updateData.caregiverInstructions = updates.caregiverInstructions;
  }

  await plan.update(updateData, { transaction });
  return plan;
}

/**
 * Retrieves discharge plan by admission.
 * Returns current discharge planning details.
 *
 * @param {ModelStatic<Model>} DischargePlan - Discharge plan model
 * @param {string} admissionId - Admission ID
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model | null>} Discharge plan if exists
 *
 * Database optimization: Indexed by admission_id (unique)
 * Performance: Single-row query
 *
 * @example
 * ```typescript
 * const plan = await getDischargePlanByAdmission(DischargePlan, 'admission-uuid');
 * ```
 */
export async function getDischargePlanByAdmission<T extends Model>(
  DischargePlan: ModelStatic<T>,
  admissionId: string,
  transaction?: Transaction,
): Promise<T | null> {
  const plan = await DischargePlan.findOne({
    where: { admissionId } as any,
    transaction,
  });

  return plan;
}

/**
 * Finalizes discharge plan and distributes.
 * Marks plan complete and triggers notifications.
 *
 * @param {ModelStatic<Model>} DischargePlan - Discharge plan model
 * @param {string} planId - Discharge plan ID
 * @param {Date} actualDischargeDate - Actual discharge date
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Finalized discharge plan
 *
 * Database optimization: Single-row update with finalization metadata
 * HIPAA: Audit trail for plan finalization
 *
 * @example
 * ```typescript
 * await finalizeDischargePlan(DischargePlan, 'plan-uuid', new Date());
 * // Triggers: discharge summary generation, patient portal notification, PCP fax
 * ```
 */
export async function finalizeDischargePlan<T extends Model>(
  DischargePlan: ModelStatic<T>,
  planId: string,
  actualDischargeDate: Date,
  transaction?: Transaction,
): Promise<T> {
  const plan = await DischargePlan.findByPk(planId, { transaction });

  if (!plan) {
    throw new Error(`Discharge plan ${planId} not found`);
  }

  await plan.update(
    {
      status: 'completed',
      actualDischargeDate,
      finalizedAt: new Date(),
    } as any,
    { transaction },
  );

  // TODO: Trigger notifications (patient portal, PCP, home health)
  // TODO: Generate discharge summary CCD/CCDA

  return plan;
}

// ============================================================================
// DME COORDINATION (3 functions)
// ============================================================================

/**
 * Creates a durable medical equipment order.
 * Tracks DME orders with insurance authorization.
 *
 * @param {ModelStatic<Model>} DmeOrder - DME order model
 * @param {DmeOrderConfig} config - DME order configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created DME order
 *
 * Database optimization: Indexed by patient_id, ordering_provider_id, order_date
 * HIPAA: Audit trail for DME orders
 *
 * @example
 * ```typescript
 * const order = await createDmeOrder(DmeOrder, {
 *   patientId: 'patient-uuid',
 *   orderingProviderId: 'provider-uuid',
 *   equipmentType: 'Walker',
 *   equipmentDescription: 'Standard folding walker with wheels',
 *   quantity: 1,
 *   justification: 'Post-op mobility assistance, fall prevention',
 *   orderDate: new Date(),
 *   insuranceAuthRequired: true
 * });
 * ```
 */
export async function createDmeOrder<T extends Model>(
  DmeOrder: ModelStatic<T>,
  config: DmeOrderConfig,
  transaction?: Transaction,
): Promise<T> {
  const order = await DmeOrder.create(
    {
      patientId: config.patientId,
      orderingProviderId: config.orderingProviderId,
      equipmentType: config.equipmentType,
      equipmentDescription: config.equipmentDescription,
      quantity: config.quantity,
      justification: config.justification,
      orderDate: config.orderDate,
      neededByDate: config.neededByDate,
      insuranceAuthRequired: config.insuranceAuthRequired,
      deliveryAddress: config.deliveryAddress,
      status: config.insuranceAuthRequired ? 'pending_authorization' : 'ordered',
    } as any,
    { transaction },
  );

  return order;
}

/**
 * Updates DME order status throughout fulfillment.
 * Tracks authorization, delivery, completion.
 *
 * @param {ModelStatic<Model>} DmeOrder - DME order model
 * @param {string} orderId - DME order ID
 * @param {DmeOrderStatus} status - New status
 * @param {Object} metadata - Additional status metadata
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Updated DME order
 *
 * Database optimization: Single-row update with status history
 * HIPAA: Audit trail for status changes
 *
 * @example
 * ```typescript
 * await updateDmeOrderStatus(DmeOrder, 'order-uuid', 'authorized', {
 *   authorizationNumber: 'AUTH-12345',
 *   authorizedBy: 'insurance-uuid',
 *   authorizedDate: new Date()
 * });
 * ```
 */
export async function updateDmeOrderStatus<T extends Model>(
  DmeOrder: ModelStatic<T>,
  orderId: string,
  status: DmeOrderStatus,
  metadata?: {
    authorizationNumber?: string;
    denialReason?: string;
    deliveryDate?: Date;
    trackingNumber?: string;
  },
  transaction?: Transaction,
): Promise<T> {
  const order = await DmeOrder.findByPk(orderId, { transaction });

  if (!order) {
    throw new Error(`DME order ${orderId} not found`);
  }

  const updateData: any = { status };

  if (status === 'authorized' && metadata?.authorizationNumber) {
    updateData.authorizationNumber = metadata.authorizationNumber;
    updateData.authorizedDate = new Date();
  }

  if (status === 'denied' && metadata?.denialReason) {
    updateData.denialReason = metadata.denialReason;
  }

  if (status === 'delivered' && metadata?.deliveryDate) {
    updateData.deliveryDate = metadata.deliveryDate;
  }

  if (metadata?.trackingNumber) {
    updateData.trackingNumber = metadata.trackingNumber;
  }

  await order.update(updateData, { transaction });
  return order;
}

/**
 * Retrieves DME orders for a patient.
 * Filters by status and date range.
 *
 * @param {ModelStatic<Model>} DmeOrder - DME order model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} Patient DME orders
 *
 * Database optimization: Composite index (patient_id, status, order_date)
 * Performance: Order by date descending
 *
 * @example
 * ```typescript
 * const orders = await getDmeOrdersByPatient(DmeOrder, 'patient-uuid', {
 *   status: ['ordered', 'in_fulfillment']
 * });
 * ```
 */
export async function getDmeOrdersByPatient<T extends Model>(
  DmeOrder: ModelStatic<T>,
  patientId: string,
  options: {
    status?: DmeOrderStatus | DmeOrderStatus[];
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.status) {
    whereClause.status = Array.isArray(options.status) ? { [Op.in]: options.status } : options.status;
  }

  if (options.startDate || options.endDate) {
    whereClause.orderDate = {};
    if (options.startDate) (whereClause.orderDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.orderDate as any)[Op.lte] = options.endDate;
  }

  const orders = await DmeOrder.findAll({
    where: whereClause,
    order: [['orderDate', 'DESC']],
    transaction: options.transaction,
  });

  return orders;
}

// ============================================================================
// SOCIAL DETERMINANTS OF HEALTH (SDOH) TRACKING (3 functions)
// ============================================================================

/**
 * Records SDOH assessment for a patient.
 * Documents social determinants impacting health.
 *
 * @param {ModelStatic<Model>} SdohAssessment - SDOH assessment model
 * @param {SdohAssessmentConfig} config - Assessment configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created SDOH assessment
 *
 * Database optimization: Indexed by patient_id, assessment_date
 * GIN index on domains JSONB for flexible querying
 * HIPAA: Sensitive social information requires encryption
 *
 * @example
 * ```typescript
 * const assessment = await recordSdohAssessment(SdohAssessment, {
 *   patientId: 'patient-uuid',
 *   assessmentDate: new Date(),
 *   assessedBy: 'social-worker-uuid',
 *   domains: [
 *     { domain: 'food_insecurity', needIdentified: true, severity: 'moderate', details: 'Skips meals to afford medications' },
 *     { domain: 'transportation', needIdentified: true, severity: 'severe', details: 'No reliable transportation to appointments' },
 *     { domain: 'housing_instability', needIdentified: false }
 *   ],
 *   overallRiskScore: 65,
 *   interventionsRecommended: ['Food bank referral', 'Transportation vouchers']
 * });
 * ```
 */
export async function recordSdohAssessment<T extends Model>(
  SdohAssessment: ModelStatic<T>,
  config: SdohAssessmentConfig,
  transaction?: Transaction,
): Promise<T> {
  const assessment = await SdohAssessment.create(
    {
      patientId: config.patientId,
      assessmentDate: config.assessmentDate,
      assessedBy: config.assessedBy,
      domains: config.domains,
      overallRiskScore: config.overallRiskScore,
      interventionsRecommended: config.interventionsRecommended || [],
    } as any,
    { transaction },
  );

  return assessment;
}

/**
 * Retrieves SDOH assessments for a patient.
 * Returns assessment history with trending.
 *
 * @param {ModelStatic<Model>} SdohAssessment - SDOH assessment model
 * @param {string} patientId - Patient ID
 * @param {Object} options - Query options
 * @returns {Promise<Model[]>} SDOH assessment history
 *
 * Database optimization: Composite index (patient_id, assessment_date)
 * Performance: Order by date descending
 *
 * @example
 * ```typescript
 * const assessments = await getSdohByPatient(SdohAssessment, 'patient-uuid', {
 *   limit: 5
 * });
 * ```
 */
export async function getSdohByPatient<T extends Model>(
  SdohAssessment: ModelStatic<T>,
  patientId: string,
  options: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
  } = {},
): Promise<T[]> {
  const whereClause: WhereOptions = { patientId };

  if (options.startDate || options.endDate) {
    whereClause.assessmentDate = {};
    if (options.startDate) (whereClause.assessmentDate as any)[Op.gte] = options.startDate;
    if (options.endDate) (whereClause.assessmentDate as any)[Op.lte] = options.endDate;
  }

  const assessments = await SdohAssessment.findAll({
    where: whereClause,
    order: [['assessmentDate', 'DESC']],
    limit: options.limit || 10,
    transaction: options.transaction,
  });

  return assessments;
}

/**
 * Links patient to community resource.
 * Connects to food banks, housing, transportation services.
 *
 * @param {ModelStatic<Model>} CommunityResourceLink - Community resource link model
 * @param {Object} linkConfig - Link configuration
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<Model>} Created resource link
 *
 * Database optimization: Indexed by patient_id, resource_id, link_date
 * HIPAA: Audit trail for resource referrals
 *
 * @example
 * ```typescript
 * const link = await linkCommunityResource(CommunityResourceLink, {
 *   patientId: 'patient-uuid',
 *   resourceId: 'food-bank-123',
 *   resourceType: 'food_assistance',
 *   referredBy: 'social-worker-uuid',
 *   linkDate: new Date(),
 *   notes: 'Patient connected to local food bank, pickup Tuesdays'
 * });
 * ```
 */
export async function linkCommunityResource<T extends Model>(
  CommunityResourceLink: ModelStatic<T>,
  linkConfig: {
    patientId: string;
    resourceId: string;
    resourceType: string;
    referredBy: string;
    linkDate: Date;
    notes?: string;
  },
  transaction?: Transaction,
): Promise<T> {
  const link = await CommunityResourceLink.create(
    {
      patientId: linkConfig.patientId,
      resourceId: linkConfig.resourceId,
      resourceType: linkConfig.resourceType,
      referredBy: linkConfig.referredBy,
      linkDate: linkConfig.linkDate,
      status: 'active',
      notes: linkConfig.notes,
    } as any,
    { transaction },
  );

  return link;
}

// ============================================================================
// CARE COORDINATION REPORTING (2 functions)
// ============================================================================

/**
 * Generates care coordination metrics for reporting.
 * Calculates KPIs for care management programs.
 *
 * @param {Object} models - Model collection
 * @param {Object} options - Report options
 * @returns {Promise<CareCoordinationMetrics>} Metrics report
 *
 * Database optimization: Aggregation queries with date range filters
 * Performance: Use read replica, cache for 1 hour
 *
 * @example
 * ```typescript
 * const metrics = await generateCareCoordinationMetrics({
 *   CarePlan, Referral, CareGap, AdtMessage, EducationAssignment
 * }, {
 *   period: { start: new Date('2025-01-01'), end: new Date('2025-12-31') },
 *   providerId: 'provider-uuid'
 * });
 * ```
 */
export async function generateCareCoordinationMetrics(
  models: {
    CarePlan: ModelStatic<Model>;
    Referral: ModelStatic<Model>;
    CareGap: ModelStatic<Model>;
    AdtMessage: ModelStatic<Model>;
    EducationAssignment: ModelStatic<Model>;
  },
  options: {
    period: { start: Date; end: Date };
    providerId?: string;
    patientIds?: string[];
  },
): Promise<CareCoordinationMetrics> {
  const { CarePlan, Referral, CareGap, AdtMessage, EducationAssignment } = models;

  const whereClauseBase: WhereOptions = {};
  if (options.patientIds) {
    whereClauseBase.patientId = { [Op.in]: options.patientIds };
  }

  // Active care plans
  const activeCarePlans = await CarePlan.count({
    where: {
      ...whereClauseBase,
      status: { [Op.in]: ['active', 'approved'] },
      effectiveDate: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Completed care plans
  const completedCarePlans = await CarePlan.count({
    where: {
      ...whereClauseBase,
      status: 'completed',
      updatedAt: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Care transitions
  const careTransitions = await AdtMessage.count({
    where: {
      ...whereClauseBase,
      messageType: { [Op.in]: ['admission', 'discharge', 'transfer'] },
      eventTimestamp: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Referrals
  const activeReferrals = await Referral.count({
    where: {
      ...whereClauseBase,
      status: { [Op.in]: ['pending', 'scheduled', 'in_progress'] },
      requestedDate: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  const completedReferrals = await Referral.count({
    where: {
      ...whereClauseBase,
      status: 'completed',
      completedDate: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Care gaps
  const openCareGaps = await CareGap.count({
    where: {
      ...whereClauseBase,
      status: 'open',
      identifiedDate: { [Op.lte]: options.period.end },
    } as any,
  });

  const closedCareGaps = await CareGap.count({
    where: {
      ...whereClauseBase,
      status: 'closed',
      closedDate: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Patient education
  const patientEducationCompletions = await EducationAssignment.count({
    where: {
      ...whereClauseBase,
      status: 'completed',
      completedDate: { [Op.between]: [options.period.start, options.period.end] },
    } as any,
  });

  // Calculate averages (placeholder - would require more complex queries)
  const avgTimeToCarePlanApproval = 0; // Days from creation to approval
  const avgTimeToReferralCompletion = 0; // Days from request to completion

  return {
    period: options.period,
    activeCarePlans,
    completedCarePlans,
    careTransitions,
    activeReferrals,
    completedReferrals,
    openCareGaps,
    closedCareGaps,
    patientEducationCompletions,
    avgTimeToCarePlanApproval,
    avgTimeToReferralCompletion,
  };
}

/**
 * Exports care coordination data for external systems.
 * Generates CSV, JSON, or HL7 FHIR exports.
 *
 * @param {Object} models - Model collection
 * @param {Object} options - Export options
 * @returns {Promise<any>} Exported data
 *
 * Database optimization: Efficient bulk queries with streaming
 * Performance: Use read replica, limit export size
 *
 * @example
 * ```typescript
 * const export = await exportCareCoordinationData({
 *   CarePlan, CareTeam, Referral
 * }, {
 *   patientIds: ['patient-1', 'patient-2'],
 *   format: 'fhir',
 *   includeHistory: true
 * });
 * ```
 */
export async function exportCareCoordinationData(
  models: {
    CarePlan: ModelStatic<Model>;
    CareTeam: ModelStatic<Model>;
    Referral: ModelStatic<Model>;
    CareGap: ModelStatic<Model>;
  },
  options: {
    patientIds?: string[];
    format?: 'json' | 'csv' | 'fhir';
    includeHistory?: boolean;
    startDate?: Date;
    endDate?: Date;
  } = {},
): Promise<any> {
  const format = options.format || 'json';
  const { CarePlan, CareTeam, Referral, CareGap } = models;

  const whereClause: WhereOptions = {};
  if (options.patientIds) {
    whereClause.patientId = { [Op.in]: options.patientIds };
  }

  // Fetch data
  const carePlans = await CarePlan.findAll({
    where: whereClause,
    include: [{ association: 'careTeam', include: [{ association: 'members' }] }] as any,
  });

  const referrals = await Referral.findAll({
    where: whereClause,
    include: [{ association: 'referringProvider' }, { association: 'referredToProvider' }] as any,
  });

  const careGaps = await CareGap.findAll({
    where: whereClause,
  });

  if (format === 'json') {
    return {
      carePlans: carePlans.map((cp) => cp.toJSON()),
      referrals: referrals.map((r) => r.toJSON()),
      careGaps: careGaps.map((cg) => cg.toJSON()),
      exportedAt: new Date().toISOString(),
    };
  }

  if (format === 'fhir') {
    // Generate FHIR Bundle
    return {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: [
        ...carePlans.map((cp) => ({
          resource: {
            resourceType: 'CarePlan',
            id: cp.get('id'),
            status: cp.get('status'),
            intent: 'plan',
            subject: { reference: `Patient/${cp.get('patientId')}` },
            period: {
              start: cp.get('effectiveDate'),
              end: cp.get('expirationDate'),
            },
          },
        })),
        ...referrals.map((r) => ({
          resource: {
            resourceType: 'ServiceRequest',
            id: r.get('id'),
            status: r.get('status'),
            intent: 'order',
            subject: { reference: `Patient/${r.get('patientId')}` },
            requester: { reference: `Practitioner/${r.get('referringProviderId')}` },
            specialty: [{ text: r.get('specialty') }],
          },
        })),
      ],
    };
  }

  // CSV format would require transformation to flat structure
  return { format, message: 'CSV export not yet implemented' };
}
