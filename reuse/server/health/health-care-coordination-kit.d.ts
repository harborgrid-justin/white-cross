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
import { Model, ModelStatic, Transaction, Order, Includeable } from 'sequelize';
/**
 * Care team member role types
 */
export type CareTeamRole = 'care_coordinator' | 'primary_care_physician' | 'specialist' | 'nurse' | 'social_worker' | 'pharmacist' | 'case_manager' | 'care_navigator' | 'community_health_worker' | 'behavioral_health_specialist';
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
export type CarePlanStatus = 'draft' | 'pending_approval' | 'approved' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived';
/**
 * Care plan type
 */
export type CarePlanType = 'comprehensive' | 'disease_specific' | 'transitional' | 'preventive' | 'palliative' | 'chronic_disease_management';
/**
 * ADT message type (Admission, Discharge, Transfer)
 */
export type AdtMessageType = 'admission' | 'discharge' | 'transfer' | 'registration' | 'pre_admission' | 'leave_of_absence';
/**
 * Discharge disposition
 */
export type DischargeDisposition = 'home' | 'home_with_home_health' | 'skilled_nursing_facility' | 'acute_rehab' | 'long_term_care' | 'hospice' | 'left_ama' | 'expired' | 'other_facility';
/**
 * Referral status
 */
export type ReferralStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'expired' | 'declined';
/**
 * Referral priority
 */
export type ReferralPriority = 'routine' | 'urgent' | 'emergent' | 'stat';
/**
 * Care gap type
 */
export type CareGapType = 'preventive_screening' | 'chronic_disease_monitoring' | 'medication_adherence' | 'follow_up_visit' | 'specialist_referral' | 'lab_test' | 'imaging_study' | 'immunization' | 'health_maintenance';
/**
 * Care gap status
 */
export type CareGapStatus = 'open' | 'in_progress' | 'closed' | 'not_applicable' | 'patient_declined';
/**
 * DME order status
 */
export type DmeOrderStatus = 'ordered' | 'pending_authorization' | 'authorized' | 'denied' | 'in_fulfillment' | 'delivered' | 'cancelled';
/**
 * SDOH domain
 */
export type SdohDomain = 'food_insecurity' | 'housing_instability' | 'transportation' | 'utility_assistance' | 'interpersonal_safety' | 'employment' | 'education' | 'social_isolation';
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
    metrics?: Array<{
        name: string;
        target: any;
        current?: any;
        unit?: string;
    }>;
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
    dischargeMedications?: Array<{
        name: string;
        instructions: string;
    }>;
    followUpAppointments?: Array<{
        provider: string;
        date?: Date;
        notes?: string;
    }>;
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
    period: {
        start: Date;
        end: Date;
    };
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
export declare function createCareTeam<T extends Model>(CareTeam: ModelStatic<T>, config: CareTeamConfig, transaction?: Transaction): Promise<T>;
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
export declare function addCareTeamMember<T extends Model>(CareTeamMember: ModelStatic<T>, config: CareTeamMemberConfig, transaction?: Transaction): Promise<T>;
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
export declare function removeCareTeamMember<T extends Model>(CareTeamMember: ModelStatic<T>, memberId: string, endDate?: Date, reason?: string, transaction?: Transaction): Promise<T>;
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
export declare function getCareTeamByPatient<T extends Model>(CareTeam: ModelStatic<T>, patientId: string, options?: {
    status?: CareTeamStatus | CareTeamStatus[];
    includeMembers?: boolean;
    includeInactive?: boolean;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function updateCareTeamRole<T extends Model>(CareTeamMember: ModelStatic<T>, memberId: string, updates: Partial<CareTeamMemberConfig>, transaction?: Transaction): Promise<T>;
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
export declare function createCarePlan<T extends Model>(CarePlan: ModelStatic<T>, config: CarePlanConfig, transaction?: Transaction): Promise<T>;
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
export declare function updateCarePlan<T extends Model>(CarePlan: ModelStatic<T>, carePlanId: string, updates: Partial<CarePlanConfig>, createNewVersion?: boolean, transaction?: Transaction): Promise<T>;
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
export declare function getCarePlansByPatient<T extends Model>(CarePlan: ModelStatic<T>, patientId: string, options?: CareCoordinationQueryOptions): Promise<PaginatedResult<T>>;
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
export declare function addCarePlanGoal<T extends Model>(CarePlan: ModelStatic<T>, carePlanId: string, goal: CarePlanGoal, transaction?: Transaction): Promise<T>;
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
export declare function addCarePlanIntervention<T extends Model>(CarePlan: ModelStatic<T>, carePlanId: string, intervention: CarePlanIntervention, transaction?: Transaction): Promise<T>;
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
export declare function approveCarePlan<T extends Model>(CarePlan: ModelStatic<T>, carePlanId: string, approvedBy: string, transaction?: Transaction): Promise<T>;
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
export declare function archiveCarePlan<T extends Model>(CarePlan: ModelStatic<T>, carePlanId: string, reason: string, transaction?: Transaction): Promise<T>;
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
export declare function recordAdmission<T extends Model>(AdtMessage: ModelStatic<T>, config: AdtMessageConfig, transaction?: Transaction): Promise<T>;
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
export declare function recordDischarge<T extends Model>(AdtMessage: ModelStatic<T>, config: AdtMessageConfig, transaction?: Transaction): Promise<T>;
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
export declare function recordTransfer<T extends Model>(AdtMessage: ModelStatic<T>, config: AdtMessageConfig, transaction?: Transaction): Promise<T>;
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
export declare function getTransitionHistory<T extends Model>(AdtMessage: ModelStatic<T>, patientId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    messageType?: AdtMessageType | AdtMessageType[];
    facilityId?: string;
    limit?: number;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function generateTransitionSummary(AdtMessage: ModelStatic<Model>, CarePlan: ModelStatic<Model>, patientId: string, dischargeId: string): Promise<Record<string, any>>;
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
export declare function createReferral<T extends Model>(Referral: ModelStatic<T>, config: ReferralConfig, transaction?: Transaction): Promise<T>;
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
export declare function updateReferralStatus<T extends Model>(Referral: ModelStatic<T>, referralId: string, status: ReferralStatus, metadata?: {
    scheduledDate?: Date;
    completedDate?: Date;
    cancelReason?: string;
    outcome?: string;
}, transaction?: Transaction): Promise<T>;
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
export declare function getReferralsByPatient<T extends Model>(Referral: ModelStatic<T>, patientId: string, options?: {
    status?: ReferralStatus | ReferralStatus[];
    specialty?: string;
    startDate?: Date;
    endDate?: Date;
    includeProviders?: boolean;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function assignReferralProvider<T extends Model>(Referral: ModelStatic<T>, referralId: string, providerId: string, transaction?: Transaction): Promise<T>;
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
export declare function closeReferral<T extends Model>(Referral: ModelStatic<T>, referralId: string, outcome: string, transaction?: Transaction): Promise<T>;
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
export declare function identifyCareGaps<T extends Model>(CareGap: ModelStatic<T>, patientId: string, clinicalData: {
    age: number;
    gender: string;
    conditions?: string[];
    medications?: string[];
    lastScreenings?: Record<string, Date>;
    lastLabTests?: Record<string, Date>;
}, transaction?: Transaction): Promise<T[]>;
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
export declare function getCareGapsByPatient<T extends Model>(CareGap: ModelStatic<T>, patientId: string, options?: {
    status?: CareGapStatus | CareGapStatus[];
    gapType?: CareGapType | CareGapType[];
    priority?: string | string[];
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function getCareGapsByPopulation(CareGap: ModelStatic<Model>, options?: {
    providerId?: string;
    patientIds?: string[];
    status?: CareGapStatus | CareGapStatus[];
    gapType?: CareGapType | CareGapType[];
    startDate?: Date;
    endDate?: Date;
}): Promise<{
    total: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
    gaps: any[];
}>;
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
export declare function closeCareGap<T extends Model>(CareGap: ModelStatic<T>, gapId: string, closureInfo: {
    closedBy: string;
    closureDate?: Date;
    interventionTaken: string;
    relatedOrderId?: string;
    outcome?: string;
}, transaction?: Transaction): Promise<T>;
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
export declare function generateCareGapReport(CareGap: ModelStatic<Model>, options?: {
    providerId?: string;
    patientIds?: string[];
    period?: {
        start: Date;
        end: Date;
    };
}): Promise<{
    summary: {
        totalGaps: number;
        openGaps: number;
        closedGaps: number;
        closureRate: number;
    };
    byType: Array<{
        type: string;
        count: number;
        closureRate: number;
    }>;
    byPriority: Array<{
        priority: string;
        count: number;
    }>;
    trendData: Array<{
        month: string;
        identified: number;
        closed: number;
    }>;
}>;
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
export declare function assignEducationMaterial<T extends Model>(EducationAssignment: ModelStatic<T>, config: EducationAssignmentConfig, transaction?: Transaction): Promise<T>;
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
export declare function trackEducationCompletion<T extends Model>(EducationAssignment: ModelStatic<T>, assignmentId: string, completionInfo: {
    completedDate?: Date;
    durationMinutes?: number;
    comprehensionScore?: number;
    patientFeedback?: string;
}, transaction?: Transaction): Promise<T>;
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
export declare function getEducationHistory<T extends Model>(EducationAssignment: ModelStatic<T>, patientId: string, options?: {
    status?: string | string[];
    topic?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function createDischargePlan<T extends Model>(DischargePlan: ModelStatic<T>, config: DischargePlanConfig, transaction?: Transaction): Promise<T>;
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
export declare function updateDischargePlan<T extends Model>(DischargePlan: ModelStatic<T>, planId: string, updates: Partial<DischargePlanConfig>, transaction?: Transaction): Promise<T>;
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
export declare function getDischargePlanByAdmission<T extends Model>(DischargePlan: ModelStatic<T>, admissionId: string, transaction?: Transaction): Promise<T | null>;
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
export declare function finalizeDischargePlan<T extends Model>(DischargePlan: ModelStatic<T>, planId: string, actualDischargeDate: Date, transaction?: Transaction): Promise<T>;
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
export declare function createDmeOrder<T extends Model>(DmeOrder: ModelStatic<T>, config: DmeOrderConfig, transaction?: Transaction): Promise<T>;
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
export declare function updateDmeOrderStatus<T extends Model>(DmeOrder: ModelStatic<T>, orderId: string, status: DmeOrderStatus, metadata?: {
    authorizationNumber?: string;
    denialReason?: string;
    deliveryDate?: Date;
    trackingNumber?: string;
}, transaction?: Transaction): Promise<T>;
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
export declare function getDmeOrdersByPatient<T extends Model>(DmeOrder: ModelStatic<T>, patientId: string, options?: {
    status?: DmeOrderStatus | DmeOrderStatus[];
    startDate?: Date;
    endDate?: Date;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function recordSdohAssessment<T extends Model>(SdohAssessment: ModelStatic<T>, config: SdohAssessmentConfig, transaction?: Transaction): Promise<T>;
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
export declare function getSdohByPatient<T extends Model>(SdohAssessment: ModelStatic<T>, patientId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    transaction?: Transaction;
}): Promise<T[]>;
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
export declare function linkCommunityResource<T extends Model>(CommunityResourceLink: ModelStatic<T>, linkConfig: {
    patientId: string;
    resourceId: string;
    resourceType: string;
    referredBy: string;
    linkDate: Date;
    notes?: string;
}, transaction?: Transaction): Promise<T>;
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
export declare function generateCareCoordinationMetrics(models: {
    CarePlan: ModelStatic<Model>;
    Referral: ModelStatic<Model>;
    CareGap: ModelStatic<Model>;
    AdtMessage: ModelStatic<Model>;
    EducationAssignment: ModelStatic<Model>;
}, options: {
    period: {
        start: Date;
        end: Date;
    };
    providerId?: string;
    patientIds?: string[];
}): Promise<CareCoordinationMetrics>;
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
export declare function exportCareCoordinationData(models: {
    CarePlan: ModelStatic<Model>;
    CareTeam: ModelStatic<Model>;
    Referral: ModelStatic<Model>;
    CareGap: ModelStatic<Model>;
}, options?: {
    patientIds?: string[];
    format?: 'json' | 'csv' | 'fhir';
    includeHistory?: boolean;
    startDate?: Date;
    endDate?: Date;
}): Promise<any>;
//# sourceMappingURL=health-care-coordination-kit.d.ts.map