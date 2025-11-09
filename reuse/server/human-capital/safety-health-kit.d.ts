/**
 * LOC: HCM_SAFE_001
 * File: /reuse/server/human-capital/safety-health-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - zod
 *   - i18next
 *
 * DOWNSTREAM (imported by):
 *   - Safety & health controllers
 *   - OSHA reporting services
 *   - Workers' compensation systems
 *   - Incident management dashboards
 *   - Health monitoring services
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Incident severity enumeration
 */
export declare enum IncidentSeverity {
    FATAL = "fatal",
    SERIOUS = "serious",
    MODERATE = "moderate",
    MINOR = "minor",
    FIRST_AID = "first_aid",
    NEAR_MISS = "near_miss"
}
/**
 * Incident type enumeration
 */
export declare enum IncidentType {
    INJURY = "injury",
    ILLNESS = "illness",
    EXPOSURE = "exposure",
    PROPERTY_DAMAGE = "property_damage",
    ENVIRONMENTAL = "environmental",
    VEHICLE_ACCIDENT = "vehicle_accident",
    WORKPLACE_VIOLENCE = "workplace_violence",
    NEAR_MISS = "near_miss"
}
/**
 * Incident status enumeration
 */
export declare enum IncidentStatus {
    REPORTED = "reported",
    UNDER_INVESTIGATION = "under_investigation",
    INVESTIGATION_COMPLETE = "investigation_complete",
    CORRECTIVE_ACTIONS_PENDING = "corrective_actions_pending",
    CLOSED = "closed"
}
/**
 * Inspection status enumeration
 */
export declare enum InspectionStatus {
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    PASSED = "passed"
}
/**
 * Hazard severity enumeration
 */
export declare enum HazardSeverity {
    IMMINENT_DANGER = "imminent_danger",
    SERIOUS = "serious",
    MODERATE = "moderate",
    LOW = "low"
}
/**
 * Hazard status enumeration
 */
export declare enum HazardStatus {
    IDENTIFIED = "identified",
    UNDER_EVALUATION = "under_evaluation",
    MITIGATION_PLANNED = "mitigation_planned",
    MITIGATION_IN_PROGRESS = "mitigation_in_progress",
    MITIGATED = "mitigated",
    ACCEPTED_RISK = "accepted_risk"
}
/**
 * PPE type enumeration
 */
export declare enum PPEType {
    RESPIRATOR = "respirator",
    SAFETY_GLASSES = "safety_glasses",
    HARD_HAT = "hard_hat",
    SAFETY_SHOES = "safety_shoes",
    GLOVES = "gloves",
    HEARING_PROTECTION = "hearing_protection",
    FACE_SHIELD = "face_shield",
    PROTECTIVE_CLOTHING = "protective_clothing",
    FALL_PROTECTION = "fall_protection",
    HIGH_VISIBILITY_VEST = "high_visibility_vest"
}
/**
 * Workers' comp claim status
 */
export declare enum WorkersCompStatus {
    REPORTED = "reported",
    ACCEPTED = "accepted",
    DENIED = "denied",
    UNDER_REVIEW = "under_review",
    MEDICAL_TREATMENT = "medical_treatment",
    MODIFIED_DUTY = "modified_duty",
    CLOSED = "closed",
    APPEALED = "appealed"
}
/**
 * Return to work status
 */
export declare enum ReturnToWorkStatus {
    NOT_STARTED = "not_started",
    MEDICAL_EVALUATION = "medical_evaluation",
    RESTRICTIONS_IDENTIFIED = "restrictions_identified",
    MODIFIED_DUTY_ASSIGNED = "modified_duty_assigned",
    FULL_DUTY_RETURNED = "full_duty_returned",
    UNABLE_TO_RETURN = "unable_to_return"
}
/**
 * Health surveillance type
 */
export declare enum HealthSurveillanceType {
    ANNUAL_PHYSICAL = "annual_physical",
    RESPIRATORY_FIT_TEST = "respiratory_fit_test",
    HEARING_CONSERVATION = "hearing_conservation",
    BLOOD_BORNE_PATHOGEN = "blood_borne_pathogen",
    HAZMAT_SCREENING = "hazmat_screening",
    DRUG_ALCOHOL_TEST = "drug_alcohol_test",
    VISION_SCREENING = "vision_screening",
    ERGONOMIC_ASSESSMENT = "ergonomic_assessment"
}
/**
 * Emergency type enumeration
 */
export declare enum EmergencyType {
    FIRE = "fire",
    MEDICAL = "medical",
    CHEMICAL_SPILL = "chemical_spill",
    NATURAL_DISASTER = "natural_disaster",
    ACTIVE_SHOOTER = "active_shooter",
    BOMB_THREAT = "bomb_threat",
    POWER_OUTAGE = "power_outage",
    EVACUATION = "evacuation"
}
/**
 * Safety training certification status
 */
export declare enum CertificationStatus {
    VALID = "valid",
    EXPIRING_SOON = "expiring_soon",
    EXPIRED = "expired",
    REVOKED = "revoked",
    PENDING = "pending"
}
/**
 * Incident report interface
 */
export interface IncidentReport {
    id: string;
    incidentNumber: string;
    incidentType: IncidentType;
    severity: IncidentSeverity;
    status: IncidentStatus;
    incidentDate: Date;
    reportedDate: Date;
    reportedBy: string;
    employeeId?: string;
    location: string;
    description: string;
    immediateCause?: string;
    rootCause?: string;
    witnessNames?: string[];
    injuryDetails?: Record<string, any>;
    propertyDamage?: number;
    workDaysLost?: number;
    restrictedWorkDays?: number;
    oshaRecordable: boolean;
    investigationNotes?: string;
    correctiveActions?: string[];
    investigatedBy?: string;
    investigationCompletedDate?: Date;
    closedDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Safety inspection interface
 */
export interface SafetyInspection {
    id: string;
    inspectionNumber: string;
    inspectionType: string;
    scheduledDate: Date;
    completedDate?: Date;
    inspector: string;
    location: string;
    status: InspectionStatus;
    score?: number;
    findingsCount?: number;
    criticalFindings?: number;
    findings?: InspectionFinding[];
    notes?: string;
}
/**
 * Inspection finding interface
 */
export interface InspectionFinding {
    id?: string;
    category: string;
    description: string;
    severity: HazardSeverity;
    photoUrls?: string[];
    correctiveAction?: string;
    responsibleParty?: string;
    dueDate?: Date;
    completedDate?: Date;
}
/**
 * Hazard interface
 */
export interface Hazard {
    id: string;
    hazardNumber: string;
    hazardType: string;
    severity: HazardSeverity;
    status: HazardStatus;
    identifiedDate: Date;
    identifiedBy: string;
    location: string;
    description: string;
    riskAssessment?: string;
    mitigationPlan?: string;
    mitigationCost?: number;
    responsibleParty?: string;
    targetCompletionDate?: Date;
    completedDate?: Date;
    photoUrls?: string[];
    metadata?: Record<string, any>;
}
/**
 * PPE issuance record
 */
export interface PPEIssuance {
    id: string;
    employeeId: string;
    ppeType: PPEType;
    itemDescription: string;
    manufacturer?: string;
    modelNumber?: string;
    serialNumber?: string;
    issuedDate: Date;
    issuedBy: string;
    expiryDate?: Date;
    returnedDate?: Date;
    size?: string;
    cost?: number;
    notes?: string;
}
/**
 * Workers' compensation claim
 */
export interface WorkersCompClaim {
    id: string;
    claimNumber: string;
    employeeId: string;
    incidentId?: string;
    injuryDate: Date;
    reportedDate: Date;
    injuryType: string;
    bodyPart: string;
    status: WorkersCompStatus;
    carrierClaimNumber?: string;
    estimatedCost?: number;
    actualCost?: number;
    medicalProvider?: string;
    lostWorkDays?: number;
    restrictedWorkDays?: number;
    settlementAmount?: number;
    closedDate?: Date;
    notes?: string;
    metadata?: Record<string, any>;
}
/**
 * Return to work plan
 */
export interface ReturnToWorkPlan {
    id: string;
    employeeId: string;
    claimId?: string;
    status: ReturnToWorkStatus;
    injuryDate: Date;
    expectedReturnDate?: Date;
    actualReturnDate?: Date;
    restrictions?: string[];
    modifiedDuties?: string[];
    accommodations?: string[];
    medicalClearance?: boolean;
    medicalProvider?: string;
    followUpDates?: Date[];
    progressNotes?: string;
    coordinator: string;
}
/**
 * Health surveillance record
 */
export interface HealthSurveillance {
    id: string;
    employeeId: string;
    surveillanceType: HealthSurveillanceType;
    scheduledDate: Date;
    completedDate?: Date;
    provider?: string;
    result?: string;
    restrictions?: string[];
    recommendations?: string[];
    nextDueDate?: Date;
    certificateUrl?: string;
    notes?: string;
}
/**
 * Safety training certification
 */
export interface SafetyCertification {
    id: string;
    employeeId: string;
    certificationName: string;
    certificationBody: string;
    issueDate: Date;
    expiryDate?: Date;
    status: CertificationStatus;
    certificateNumber?: string;
    certificateUrl?: string;
    instructor?: string;
    score?: number;
    renewalRequired: boolean;
}
/**
 * Emergency drill record
 */
export interface EmergencyDrill {
    id: string;
    drillType: EmergencyType;
    scheduledDate: Date;
    completedDate?: Date;
    location: string;
    participantCount?: number;
    durationMinutes?: number;
    successful: boolean;
    findings?: string[];
    improvements?: string[];
    conductedBy: string;
    notes?: string;
}
/**
 * Safety committee meeting
 */
export interface SafetyCommitteeMeeting {
    id: string;
    meetingDate: Date;
    location: string;
    attendees: string[];
    agenda: string[];
    minutes?: string;
    actionItems?: ActionItem[];
    nextMeetingDate?: Date;
    chairperson: string;
}
/**
 * Action item interface
 */
export interface ActionItem {
    id?: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    completedDate?: Date;
    status: string;
}
/**
 * Incident report validation schema
 */
export declare const IncidentReportSchema: any;
/**
 * Safety inspection validation schema
 */
export declare const SafetyInspectionSchema: any;
/**
 * Hazard validation schema
 */
export declare const HazardSchema: any;
/**
 * PPE issuance validation schema
 */
export declare const PPEIssuanceSchema: any;
/**
 * Workers' comp claim validation schema
 */
export declare const WorkersCompClaimSchema: any;
/**
 * Return to work plan validation schema
 */
export declare const ReturnToWorkPlanSchema: any;
/**
 * Health surveillance validation schema
 */
export declare const HealthSurveillanceSchema: any;
/**
 * Safety certification validation schema
 */
export declare const SafetyCertificationSchema: any;
/**
 * Incident Report Model
 */
export declare class IncidentReportModel extends Model {
    id: string;
    incidentNumber: string;
    incidentType: IncidentType;
    severity: IncidentSeverity;
    status: IncidentStatus;
    incidentDate: Date;
    reportedDate: Date;
    reportedBy: string;
    employeeId: string;
    location: string;
    description: string;
    immediateCause: string;
    rootCause: string;
    witnessNames: string[];
    injuryDetails: Record<string, any>;
    propertyDamage: number;
    workDaysLost: number;
    restrictedWorkDays: number;
    oshaRecordable: boolean;
    investigationNotes: string;
    correctiveActions: string[];
    investigatedBy: string;
    investigationCompletedDate: Date;
    closedDate: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Safety Inspection Model
 */
export declare class SafetyInspectionModel extends Model {
    id: string;
    inspectionNumber: string;
    inspectionType: string;
    scheduledDate: Date;
    completedDate: Date;
    inspector: string;
    location: string;
    status: InspectionStatus;
    score: number;
    findingsCount: number;
    criticalFindings: number;
    notes: string;
    findings: InspectionFindingModel[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Inspection Finding Model
 */
export declare class InspectionFindingModel extends Model {
    id: string;
    inspectionId: string;
    category: string;
    description: string;
    severity: HazardSeverity;
    photoUrls: string[];
    correctiveAction: string;
    responsibleParty: string;
    dueDate: Date;
    completedDate: Date;
    inspection: SafetyInspectionModel;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Hazard Model
 */
export declare class HazardModel extends Model {
    id: string;
    hazardNumber: string;
    hazardType: string;
    severity: HazardSeverity;
    status: HazardStatus;
    identifiedDate: Date;
    identifiedBy: string;
    location: string;
    description: string;
    riskAssessment: string;
    mitigationPlan: string;
    mitigationCost: number;
    responsibleParty: string;
    targetCompletionDate: Date;
    completedDate: Date;
    photoUrls: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * PPE Issuance Model
 */
export declare class PPEIssuanceModel extends Model {
    id: string;
    employeeId: string;
    ppeType: PPEType;
    itemDescription: string;
    manufacturer: string;
    modelNumber: string;
    serialNumber: string;
    issuedDate: Date;
    issuedBy: string;
    expiryDate: Date;
    returnedDate: Date;
    size: string;
    cost: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Workers' Compensation Claim Model
 */
export declare class WorkersCompClaimModel extends Model {
    id: string;
    claimNumber: string;
    employeeId: string;
    incidentId: string;
    injuryDate: Date;
    reportedDate: Date;
    injuryType: string;
    bodyPart: string;
    status: WorkersCompStatus;
    carrierClaimNumber: string;
    estimatedCost: number;
    actualCost: number;
    medicalProvider: string;
    lostWorkDays: number;
    restrictedWorkDays: number;
    settlementAmount: number;
    closedDate: Date;
    notes: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
/**
 * Return to Work Plan Model
 */
export declare class ReturnToWorkPlanModel extends Model {
    id: string;
    employeeId: string;
    claimId: string;
    status: ReturnToWorkStatus;
    injuryDate: Date;
    expectedReturnDate: Date;
    actualReturnDate: Date;
    restrictions: string[];
    modifiedDuties: string[];
    accommodations: string[];
    medicalClearance: boolean;
    medicalProvider: string;
    followUpDates: Date[];
    progressNotes: string;
    coordinator: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Health Surveillance Model
 */
export declare class HealthSurveillanceModel extends Model {
    id: string;
    employeeId: string;
    surveillanceType: HealthSurveillanceType;
    scheduledDate: Date;
    completedDate: Date;
    provider: string;
    result: string;
    restrictions: string[];
    recommendations: string[];
    nextDueDate: Date;
    certificateUrl: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Safety Certification Model
 */
export declare class SafetyCertificationModel extends Model {
    id: string;
    employeeId: string;
    certificationName: string;
    certificationBody: string;
    issueDate: Date;
    expiryDate: Date;
    status: CertificationStatus;
    certificateNumber: string;
    certificateUrl: string;
    instructor: string;
    score: number;
    renewalRequired: boolean;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Emergency Drill Model
 */
export declare class EmergencyDrillModel extends Model {
    id: string;
    drillType: EmergencyType;
    scheduledDate: Date;
    completedDate: Date;
    location: string;
    participantCount: number;
    durationMinutes: number;
    successful: boolean;
    findings: string[];
    improvements: string[];
    conductedBy: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Safety Committee Meeting Model
 */
export declare class SafetyCommitteeMeetingModel extends Model {
    id: string;
    meetingDate: Date;
    location: string;
    attendees: string[];
    agenda: string[];
    minutes: string;
    actionItems: ActionItem[];
    nextMeetingDate: Date;
    chairperson: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create incident report
 */
export declare function createIncidentReport(reportData: Omit<IncidentReport, 'id'>, transaction?: Transaction): Promise<IncidentReportModel>;
/**
 * Update incident report
 */
export declare function updateIncidentReport(incidentId: string, updates: Partial<IncidentReport>, transaction?: Transaction): Promise<IncidentReportModel>;
/**
 * Get OSHA recordable incidents
 */
export declare function getOSHARecordableIncidents(startDate?: Date, endDate?: Date): Promise<IncidentReportModel[]>;
/**
 * Get near-miss incidents
 */
export declare function getNearMissIncidents(limit?: number): Promise<IncidentReportModel[]>;
/**
 * Close incident
 */
export declare function closeIncident(incidentId: string, transaction?: Transaction): Promise<void>;
/**
 * Create safety inspection
 */
export declare function createSafetyInspection(inspectionData: Omit<SafetyInspection, 'id'>, transaction?: Transaction): Promise<SafetyInspectionModel>;
/**
 * Complete safety inspection
 */
export declare function completeSafetyInspection(inspectionId: string, score: number, findings: InspectionFinding[], transaction?: Transaction): Promise<void>;
/**
 * Get upcoming inspections
 */
export declare function getUpcomingInspections(daysAhead?: number): Promise<SafetyInspectionModel[]>;
/**
 * Get failed inspections
 */
export declare function getFailedInspections(): Promise<SafetyInspectionModel[]>;
/**
 * Create hazard
 */
export declare function createHazard(hazardData: Omit<Hazard, 'id'>, transaction?: Transaction): Promise<HazardModel>;
/**
 * Update hazard status
 */
export declare function updateHazardStatus(hazardId: string, status: HazardStatus, transaction?: Transaction): Promise<void>;
/**
 * Get open hazards
 */
export declare function getOpenHazards(severity?: HazardSeverity): Promise<HazardModel[]>;
/**
 * Get imminent danger hazards
 */
export declare function getImminentDangerHazards(): Promise<HazardModel[]>;
/**
 * Issue PPE to employee
 */
export declare function issuePPE(ppeData: Omit<PPEIssuance, 'id'>, transaction?: Transaction): Promise<PPEIssuanceModel>;
/**
 * Return PPE
 */
export declare function returnPPE(ppeId: string, transaction?: Transaction): Promise<void>;
/**
 * Get employee PPE
 */
export declare function getEmployeePPE(employeeId: string): Promise<PPEIssuanceModel[]>;
/**
 * Get expiring PPE
 */
export declare function getExpiringPPE(daysAhead?: number): Promise<PPEIssuanceModel[]>;
/**
 * Create workers' comp claim
 */
export declare function createWorkersCompClaim(claimData: Omit<WorkersCompClaim, 'id'>, transaction?: Transaction): Promise<WorkersCompClaimModel>;
/**
 * Update claim status
 */
export declare function updateClaimStatus(claimId: string, status: WorkersCompStatus, transaction?: Transaction): Promise<void>;
/**
 * Get open claims
 */
export declare function getOpenClaims(): Promise<WorkersCompClaimModel[]>;
/**
 * Calculate total claim costs
 */
export declare function calculateTotalClaimCosts(startDate?: Date, endDate?: Date): Promise<number>;
/**
 * Create return to work plan
 */
export declare function createReturnToWorkPlan(planData: Omit<ReturnToWorkPlan, 'id'>, transaction?: Transaction): Promise<ReturnToWorkPlanModel>;
/**
 * Update RTW plan status
 */
export declare function updateRTWPlanStatus(planId: string, status: ReturnToWorkStatus, transaction?: Transaction): Promise<void>;
/**
 * Get active RTW plans
 */
export declare function getActiveRTWPlans(): Promise<ReturnToWorkPlanModel[]>;
/**
 * Schedule health surveillance
 */
export declare function scheduleHealthSurveillance(surveillanceData: Omit<HealthSurveillance, 'id'>, transaction?: Transaction): Promise<HealthSurveillanceModel>;
/**
 * Complete health surveillance
 */
export declare function completeHealthSurveillance(surveillanceId: string, result: string, nextDueDate?: Date, transaction?: Transaction): Promise<void>;
/**
 * Get due health surveillance
 */
export declare function getDueHealthSurveillance(): Promise<HealthSurveillanceModel[]>;
/**
 * Record safety certification
 */
export declare function recordSafetyCertification(certData: Omit<SafetyCertification, 'id'>, transaction?: Transaction): Promise<SafetyCertificationModel>;
/**
 * Get expiring certifications
 */
export declare function getExpiringCertifications(daysAhead?: number): Promise<SafetyCertificationModel[]>;
/**
 * Get employee certifications
 */
export declare function getEmployeeCertifications(employeeId: string): Promise<SafetyCertificationModel[]>;
/**
 * Schedule emergency drill
 */
export declare function scheduleEmergencyDrill(drillData: Omit<EmergencyDrill, 'id'>, transaction?: Transaction): Promise<EmergencyDrillModel>;
/**
 * Complete emergency drill
 */
export declare function completeEmergencyDrill(drillId: string, participantCount: number, durationMinutes: number, successful: boolean, findings?: string[], transaction?: Transaction): Promise<void>;
/**
 * Get upcoming drills
 */
export declare function getUpcomingDrills(): Promise<EmergencyDrillModel[]>;
/**
 * Create safety committee meeting
 */
export declare function createSafetyCommitteeMeeting(meetingData: Omit<SafetyCommitteeMeeting, 'id'>, transaction?: Transaction): Promise<SafetyCommitteeMeetingModel>;
/**
 * Get recent committee meetings
 */
export declare function getRecentCommitteeMeetings(limit?: number): Promise<SafetyCommitteeMeetingModel[]>;
/**
 * Calculate incident rate
 */
export declare function calculateIncidentRate(incidents: number, hoursWorked: number): number;
/**
 * Calculate DART rate (Days Away, Restricted, or Transferred)
 */
export declare function calculateDARTRate(dartCases: number, hoursWorked: number): number;
/**
 * Get safety dashboard metrics
 */
export declare function getSafetyDashboardMetrics(): Promise<{
    openIncidents: number;
    oshaRecordable: number;
    openHazards: number;
    imminentDangers: number;
    openClaims: number;
    activeRTWPlans: number;
    upcomingInspections: number;
    expiringCertifications: number;
}>;
/**
 * Get incident by number
 */
export declare function getIncidentByNumber(incidentNumber: string): Promise<IncidentReportModel | null>;
/**
 * Get claim by number
 */
export declare function getClaimByNumber(claimNumber: string): Promise<WorkersCompClaimModel | null>;
/**
 * Get hazard by number
 */
export declare function getHazardByNumber(hazardNumber: string): Promise<HazardModel | null>;
/**
 * Get inspection by number
 */
export declare function getInspectionByNumber(inspectionNumber: string): Promise<SafetyInspectionModel | null>;
/**
 * Get employee incident history
 */
export declare function getEmployeeIncidentHistory(employeeId: string): Promise<IncidentReportModel[]>;
/**
 * Get employee claims
 */
export declare function getEmployeeClaims(employeeId: string): Promise<WorkersCompClaimModel[]>;
/**
 * Generate OSHA 300 log data for reporting year
 */
export declare function generateOSHA300Log(year: number): Promise<{
    year: number;
    incidents: IncidentReportModel[];
    totalRecordable: number;
    daysAwayFromWork: number;
    daysOfRestrictedWork: number;
    totalDeaths: number;
}>;
export declare class SafetyHealthService {
    createIncident(data: Omit<IncidentReport, 'id'>): Promise<IncidentReportModel>;
    createInspection(data: Omit<SafetyInspection, 'id'>): Promise<SafetyInspectionModel>;
    createHazard(data: Omit<Hazard, 'id'>): Promise<HazardModel>;
    issuePPE(data: Omit<PPEIssuance, 'id'>): Promise<PPEIssuanceModel>;
    createClaim(data: Omit<WorkersCompClaim, 'id'>): Promise<WorkersCompClaimModel>;
    getDashboard(): Promise<{
        openIncidents: number;
        oshaRecordable: number;
        openHazards: number;
        imminentDangers: number;
        openClaims: number;
        activeRTWPlans: number;
        upcomingInspections: number;
        expiringCertifications: number;
    }>;
}
export declare class SafetyHealthController {
    private readonly safetyService;
    constructor(safetyService: SafetyHealthService);
    getDashboard(): Promise<{
        openIncidents: number;
        oshaRecordable: number;
        openHazards: number;
        imminentDangers: number;
        openClaims: number;
        activeRTWPlans: number;
        upcomingInspections: number;
        expiringCertifications: number;
    }>;
    createIncident(data: Omit<IncidentReport, 'id'>): Promise<IncidentReportModel>;
    createHazard(data: Omit<Hazard, 'id'>): Promise<HazardModel>;
    createClaim(data: Omit<WorkersCompClaim, 'id'>): Promise<WorkersCompClaimModel>;
}
export { IncidentReportModel, SafetyInspectionModel, InspectionFindingModel, HazardModel, PPEIssuanceModel, WorkersCompClaimModel, ReturnToWorkPlanModel, HealthSurveillanceModel, SafetyCertificationModel, EmergencyDrillModel, SafetyCommitteeMeetingModel, SafetyHealthService, SafetyHealthController, };
//# sourceMappingURL=safety-health-kit.d.ts.map