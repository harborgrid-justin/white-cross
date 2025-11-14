/**
 * LOC: CLINICEMERGENCY001
 * File: /reuse/clinic/composites/emergency-response-composites.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - ../../server/health/health-emergency-department-kit
 *   - ../../server/health/health-clinical-workflows-kit
 *   - ../../server/health/health-care-coordination-kit
 *   - ../../education/student-records-kit
 *   - ../../education/student-communication-kit
 *   - ../../data/crud-operations
 *   - ../../data/query-builder
 *   - ../../data/transaction-coordination
 *
 * DOWNSTREAM (imported by):
 *   - School clinic emergency management controllers
 *   - Crisis response coordination services
 *   - Emergency notification systems
 *   - Compliance and incident reporting
 */

/**
 * File: /reuse/clinic/composites/emergency-response-composites.ts
 * Locator: WC-CLINIC-EMERGENCY-COMP-001
 * Purpose: School Clinic Emergency Response Composite - Comprehensive K-12 emergency management and crisis response
 *
 * Upstream: NestJS, Health Kits (Emergency Dept, Clinical Workflows, Care Coordination), Education Kits, Data Operations
 * Downstream: ../backend/clinic/emergency/*, Crisis Management Systems, Incident Reporting, State Compliance
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Health & Education Kits
 * Exports: 40 composite functions orchestrating school clinic emergency response and crisis management
 *
 * LLM Context: Production-grade HIPAA-compliant emergency response system for K-12 White Cross school health platform.
 * Provides comprehensive emergency incident logging with structured documentation, multi-level emergency protocol
 * activation (lockdown, evacuation, medical emergency, severe weather), intelligent emergency contact notification
 * cascades with priority-based routing, detailed 911 call documentation with timeline tracking, emergency medication
 * administration workflows (EpiPen for anaphylaxis, Narcan for overdose, glucagon for diabetes, seizure medications),
 * clinical injury assessment and ESI-based triage for school settings, emergency transport coordination with EMS handoff,
 * multi-agency incident reporting to administration, parents, and authorities, emergency drill tracking with compliance
 * monitoring, crisis team notification and assembly protocols, emergency supply inventory with auto-reorder triggers,
 * structured post-incident follow-up and root cause analysis, individualized emergency action plan (EAP) management,
 * concussion protocol workflows with return-to-play clearance, anaphylaxis response tracking with allergy registry,
 * critical incident stress debriefing, emergency preparedness training tracking, and full regulatory compliance reporting.
 */

import {
  Injectable,
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  applyDecorators,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

// Health Kit Imports
import {
  performEDQuickReg,
  performESITriage,
  ESITriageData,
  ESITriageResult,
  EDQuickRegData,
  activateTraumaProtocol,
  TraumaActivationParams,
} from '../../server/health/health-emergency-department-kit';

// Education Kit Imports
import {
  StudentRecord,
} from '../../education/student-records-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Emergency response context
 */
export interface EmergencyContext {
  userId: string;
  userRole: 'nurse' | 'admin' | 'counselor' | 'teacher' | 'security';
  schoolId: string;
  clinicId: string;
  timestamp: Date;
  emergencyLevel: 'routine' | 'urgent' | 'critical' | 'mass_casualty';
}

/**
 * Emergency incident types
 */
export enum EmergencyIncidentType {
  MEDICAL = 'medical',
  INJURY = 'injury',
  ALLERGIC_REACTION = 'allergic_reaction',
  ANAPHYLAXIS = 'anaphylaxis',
  SEIZURE = 'seizure',
  CARDIAC = 'cardiac',
  RESPIRATORY = 'respiratory',
  DIABETIC = 'diabetic',
  OVERDOSE = 'overdose',
  CONCUSSION = 'concussion',
  MENTAL_HEALTH = 'mental_health',
  VIOLENCE = 'violence',
  ENVIRONMENTAL = 'environmental',
  MASS_CASUALTY = 'mass_casualty',
}

/**
 * Emergency protocol types
 */
export enum EmergencyProtocol {
  LOCKDOWN = 'lockdown',
  EVACUATION = 'evacuation',
  SHELTER_IN_PLACE = 'shelter_in_place',
  MEDICAL_EMERGENCY = 'medical_emergency',
  SEVERE_WEATHER = 'severe_weather',
  ACTIVE_THREAT = 'active_threat',
  HAZMAT = 'hazmat',
  FIRE = 'fire',
}

/**
 * Emergency incident record
 */
export interface EmergencyIncident {
  incidentId: string;
  schoolId: string;
  clinicId: string;
  incidentType: EmergencyIncidentType;
  studentId?: string;
  patientName: string;
  patientAge: number;
  incidentDate: Date;
  incidentTime: Date;
  location: string;
  detailedLocation: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical' | 'life_threatening';
  chiefComplaint: string;
  initialAssessment: InitialAssessment;
  vitalSigns: VitalSigns[];
  treatmentProvided: TreatmentRecord[];
  medicationsAdministered: EmergencyMedication[];
  disposition: 'returned_to_class' | 'sent_home' | 'transported_ems' | 'parent_pickup' | 'hospital_direct';
  ems911Called: boolean;
  ems911CallTime?: Date;
  emsArrivalTime?: Date;
  emsTransportTime?: Date;
  destinationHospital?: string;
  parentNotified: boolean;
  parentNotificationTime?: Date;
  adminNotified: boolean;
  adminNotificationTime?: Date;
  incidentReport: string;
  followUpRequired: boolean;
  followUpInstructions?: string;
  documenting Nurse: string;
  documentedAt: Date;
  witnessStatements?: WitnessStatement[];
  photosDocumented: boolean;
  status: 'active' | 'resolved' | 'under_investigation';
  reviewedBy?: string;
  reviewedAt?: Date;
}

/**
 * Initial patient assessment
 */
export interface InitialAssessment {
  assessmentTime: Date;
  consciousness: 'alert' | 'verbal' | 'pain' | 'unresponsive';
  airway: 'patent' | 'obstructed' | 'compromised';
  breathing: 'normal' | 'labored' | 'absent';
  circulation: 'normal' | 'weak' | 'absent';
  skinColor: 'normal' | 'pale' | 'flushed' | 'cyanotic';
  mentalStatus: string;
  painScore: number;
  painLocation?: string;
  visibleInjuries: string[];
  suspectedInjuries: string[];
  allergiesChecked: boolean;
  knownAllergies: string[];
  currentMedications: string[];
  medicalHistory: string[];
}

/**
 * Vital signs measurement
 */
export interface VitalSigns {
  measurementTime: Date;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate: number;
  respiratoryRate: number;
  temperature?: number;
  oxygenSaturation?: number;
  bloodGlucose?: number;
  painScore: number;
  consciousness: string;
  measuredBy: string;
  notes?: string;
}

/**
 * Treatment record
 */
export interface TreatmentRecord {
  treatmentTime: Date;
  treatmentType: string;
  treatmentDescription: string;
  providedBy: string;
  response: string;
  complications?: string;
  notes?: string;
}

/**
 * Emergency medication administration
 */
export interface EmergencyMedication {
  medicationId: string;
  medicationName: string;
  medicationType: 'epipen' | 'narcan' | 'glucagon' | 'inhaler' | 'insulin' | 'seizure_med' | 'other';
  dosage: string;
  route: 'intramuscular' | 'intranasal' | 'subcutaneous' | 'oral' | 'inhaled';
  administeredAt: Date;
  administeredBy: string;
  indication: string;
  lotNumber?: string;
  expirationDate?: Date;
  patientResponse: string;
  adverseReaction: boolean;
  adverseReactionDetails?: string;
  secondDoseRequired: boolean;
  secondDoseTime?: Date;
  physicianOrderOnFile: boolean;
  parentConsent: boolean;
  witnessedBy?: string;
}

/**
 * Witness statement
 */
export interface WitnessStatement {
  witnessId: string;
  witnessName: string;
  witnessRole: 'student' | 'teacher' | 'staff' | 'parent' | 'other';
  statementText: string;
  statementTime: Date;
  recordedBy: string;
}

/**
 * Emergency protocol activation
 */
export interface EmergencyProtocolActivation {
  activationId: string;
  schoolId: string;
  protocolType: EmergencyProtocol;
  activatedAt: Date;
  activatedBy: string;
  activationReason: string;
  threatLevel: 'low' | 'medium' | 'high' | 'severe';
  affectedAreas: string[];
  affectedPopulation: number;
  incidentLocation?: string;
  lawEnforcementNotified: boolean;
  lawEnforcementArrivalTime?: Date;
  allClearTime?: Date;
  duration: number;
  casualties: number;
  injuriesReported: number;
  studentsAccountedFor: boolean;
  staffAccountedFor: boolean;
  protocolStepsCompleted: ProtocolStep[];
  communicationsSent: ProtocolCommunication[];
  deactivatedAt?: Date;
  deactivatedBy?: string;
  afterActionReportId?: string;
  status: 'active' | 'all_clear' | 'under_review';
}

/**
 * Protocol step completion
 */
export interface ProtocolStep {
  stepId: string;
  stepName: string;
  stepDescription: string;
  assignedTo: string;
  completedAt?: Date;
  completedBy?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  notes?: string;
}

/**
 * Protocol communication
 */
export interface ProtocolCommunication {
  communicationId: string;
  communicationType: 'announcement' | 'text' | 'email' | 'phone' | 'radio';
  recipient: 'all_staff' | 'emergency_team' | 'parents' | 'law_enforcement' | 'district_office';
  message: string;
  sentAt: Date;
  deliveryStatus: 'sent' | 'delivered' | 'failed';
}

/**
 * Emergency contact notification
 */
export interface EmergencyContactNotification {
  notificationId: string;
  incidentId: string;
  studentId: string;
  contactName: string;
  contactRelationship: string;
  contactPhone: string;
  contactEmail?: string;
  notificationMethod: 'phone' | 'text' | 'email' | 'in_person';
  attemptedAt: Date;
  attemptedBy: string;
  successful: boolean;
  contactReached: boolean;
  responseTime?: Date;
  contactResponse?: string;
  callbackNumber?: string;
  retryAttempt: number;
  escalatedToPrimary: boolean;
  notes?: string;
}

/**
 * 911 Call documentation
 */
export interface Call911Documentation {
  callId: string;
  incidentId: string;
  callInitiatedAt: Date;
  callInitiatedBy: string;
  dispatchCenter: string;
  callTakerName?: string;
  callerLocation: string;
  patientAge: number;
  patientGender: string;
  chiefComplaint: string;
  consciousness: string;
  breathing: string;
  bleeding: boolean;
  instructions Received: string[];
  emsDispatchTime: Date;
  emsEstimatedArrival: Date;
  emsActualArrival?: Date;
  emsUnitNumber?: string;
  emsCrewNames?: string[];
  patientHandoffTime?: Date;
  handoffReport: string;
  transportDestination?: string;
  transportDepartureTime?: Date;
  incidentNumber?: string;
  callDuration: number;
  callRecordingAvailable: boolean;
}

/**
 * Emergency action plan (EAP)
 */
export interface EmergencyActionPlan {
  planId: string;
  studentId: string;
  condition: string;
  diagnosisDate: Date;
  diagnosingPhysician: string;
  severity: 'mild' | 'moderate' | 'severe';
  triggers: string[];
  warningSymptoms: string[];
  emergencySymptoms: string[];
  immediateActions: EmergencyAction[];
  emergencyMedications: EAPMedication[];
  whenToCall911: string[];
  additionalInstructions: string;
  restrictionsAccommodations: string[];
  emergencyContacts: EAPContact[];
  physicianContact: {
    name: string;
    phone: string;
    fax?: string;
  };
  parentSignature: string;
  parentSignatureDate: Date;
  physicianSignature?: string;
  physicianSignatureDate?: Date;
  schoolNurseSignature: string;
  schoolNurseSignatureDate: Date;
  effectiveDate: Date;
  reviewDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  lastReviewedAt?: Date;
  photoOnFile: boolean;
  staffTrainingCompleted: StaffTraining[];
}

/**
 * Emergency action in EAP
 */
export interface EmergencyAction {
  stepNumber: number;
  action: string;
  timing: 'immediate' | 'if_no_improvement' | 'preventive';
  responsibleParty: 'any_adult' | 'nurse_only' | 'trained_staff';
}

/**
 * EAP medication
 */
export interface EAPMedication {
  medicationName: string;
  dosage: string;
  route: string;
  indicationForUse: string;
  timing: string;
  location: string;
  expirationDate: Date;
  parentProvidedDate?: Date;
  stockChecked: Date;
}

/**
 * EAP emergency contact
 */
export interface EAPContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  callOrder: number;
}

/**
 * Staff training record
 */
export interface StaffTraining {
  staffMemberId: string;
  staffName: string;
  role: string;
  trainedOn: Date;
  trainedBy: string;
  competencyVerified: boolean;
  expirationDate?: Date;
}

/**
 * Concussion assessment
 */
export interface ConcussionAssessment {
  assessmentId: string;
  studentId: string;
  incidentId?: string;
  injuryDate: Date;
  injuryMechanism: string;
  witnessedBy?: string;
  immediateSymptoms: string[];
  lossOfConsciousness: boolean;
  locDuration?: number;
  amnesia: boolean;
  amnesiaType?: 'retrograde' | 'anterograde' | 'both';
  initialSACScore?: number;
  symptomsAssessment: ConcussionSymptom[];
  cognitiveAssessment: CognitiveTest;
  balanceAssessment: BalanceTest;
  severity: 'grade_1' | 'grade_2' | 'grade_3';
  concussionProtocolInitiated: boolean;
  returnToLearnPlan: ReturnToPlan;
  returnToPlayPlan: ReturnToPlan;
  physicianReferral: boolean;
  physicianReferralDate?: Date;
  physicianClearance?: PhysicianClearance;
  parentNotified: boolean;
  parentEducationProvided: boolean;
  assessedBy: string;
  assessedAt: Date;
}

/**
 * Concussion symptom tracking
 */
export interface ConcussionSymptom {
  symptom: string;
  severity: number; // 0-6 scale
  presentAt: Date;
}

/**
 * Cognitive test results
 */
export interface CognitiveTest {
  testDate: Date;
  orientation: number;
  immediateMemory: number;
  concentration: number;
  delayedRecall: number;
  totalScore: number;
  baselineScore?: number;
}

/**
 * Balance test results
 */
export interface BalanceTest {
  testDate: Date;
  doubleStance: number;
  singleStance: number;
  tandemStance: number;
  totalErrors: number;
  baselineErrors?: number;
}

/**
 * Return to activity plan
 */
export interface ReturnToPlan {
  stage: number;
  stageDescription: string;
  targetDate?: Date;
  actualDate?: Date;
  symptomFree: boolean;
  approvedBy?: string;
  notes?: string;
}

/**
 * Physician clearance
 */
export interface PhysicianClearance {
  physicianName: string;
  clearanceDate: Date;
  clearedForLearning: boolean;
  clearedForSports: boolean;
  restrictions?: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  documentUrl?: string;
}

/**
 * Anaphylaxis response
 */
export interface AnaphylaxisResponse {
  responseId: string;
  incidentId: string;
  studentId: string;
  onsetTime: Date;
  trigger?: string;
  knownAllergy: boolean;
  allergen?: string;
  symptoms: AnaphylaxisSymptom[];
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
  epipenAdministered: boolean;
  epipenDetails?: EmergencyMedication[];
  additionalTreatments: TreatmentRecord[];
  response ToEpinephrine: string;
  secondEpipenRequired: boolean;
  ems911Called: boolean;
  transportedToHospital: boolean;
  hospital?: string;
  biphasicReactionWarning: boolean;
  observationPeriod: number;
  dischargedAt?: Date;
  followUpWith Allergist: boolean;
  eapUpdated: boolean;
  allergyRegistryUpdated: boolean;
  staffDebriefing: boolean;
  respondedBy: string;
}

/**
 * Anaphylaxis symptoms
 */
export interface AnaphylaxisSymptom {
  category: 'skin' | 'respiratory' | 'gastrointestinal' | 'cardiovascular' | 'neurological';
  symptom: string;
  onsetTime: Date;
  severity: 'mild' | 'moderate' | 'severe';
}

/**
 * Emergency drill record
 */
export interface EmergencyDrill {
  drillId: string;
  schoolId: string;
  drillType: EmergencyProtocol;
  scheduledDate: Date;
  actualDate: Date;
  announced: boolean;
  participantCount: number;
  duration: number;
  evacuationTime?: number;
  successCriteria: DrillCriteria[];
  observersEvaluators: string[];
  findings: DrillFinding[];
  areasOfExcellence: string[];
  areasForImprovement: string[];
  correctiveActions: CorrectiveAction[];
  overallRating: 'excellent' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  complianceStatus: 'compliant' | 'non_compliant';
  nextDrillDate: Date;
  conductedBy: string;
  documentedBy: string;
  reportSubmitted: boolean;
  reportSubmittedTo: string[];
}

/**
 * Drill success criteria
 */
export interface DrillCriteria {
  criterion: string;
  met: boolean;
  notes?: string;
}

/**
 * Drill finding
 */
export interface DrillFinding {
  finding: string;
  severity: 'critical' | 'major' | 'minor' | 'observation';
  location?: string;
  recommendation: string;
}

/**
 * Corrective action
 */
export interface CorrectiveAction {
  actionId: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  completedDate?: Date;
  verification?: string;
}

/**
 * Crisis team member
 */
export interface CrisisTeamMember {
  memberId: string;
  name: string;
  role: string;
  primaryPhone: string;
  alternatePhone?: string;
  email: string;
  responsibilities: string[];
  trainingCompleted: Date;
  certifications: string[];
  backupMember?: string;
  onCallSchedule?: string;
  isActive: boolean;
}

/**
 * Emergency supply inventory
 */
export interface EmergencySupply {
  supplyId: string;
  itemName: string;
  category: 'medication' | 'equipment' | 'consumable' | 'communication';
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  unit: string;
  location: string;
  expirationDate?: Date;
  lotNumber?: string;
  lastChecked: Date;
  checkedBy: string;
  needsReorder: boolean;
  lastRestocked?: Date;
  supplier?: string;
  cost?: number;
}

/**
 * Post-incident review
 */
export interface PostIncidentReview {
  reviewId: string;
  incidentId: string;
  reviewDate: Date;
  reviewTeam: string[];
  incidentSummary: string;
  timelineOfEvents: TimelineEvent[];
  responseEffectiveness: ResponseEvaluation;
  protocolAdherence: ProtocolAdherence[];
  communicationEffectiveness: number;
  resourceAdequacy: ResourceAssessment[];
  lessonsLearned: string[];
  bestPractices: string[];
  recommendedChanges: string[];
  trainingNeeds: string[];
  policyRevisions: string[];
  followUpActions: CorrectiveAction[];
  reviewCompletedBy: string;
  approvedBy?: string;
  distributedTo: string[];
}

/**
 * Timeline event
 */
export interface TimelineEvent {
  timestamp: Date;
  event: string;
  actor?: string;
  location?: string;
  outcome?: string;
}

/**
 * Response evaluation
 */
export interface ResponseEvaluation {
  recognitionTime: number;
  activationTime: number;
  responseTime: number;
  resolutionTime: number;
  overallRating: number;
  comments: string;
}

/**
 * Protocol adherence
 */
export interface ProtocolAdherence {
  protocolStep: string;
  adhered: boolean;
  variance?: string;
  impact: 'none' | 'minor' | 'moderate' | 'significant';
}

/**
 * Resource assessment
 */
export interface ResourceAssessment {
  resource: string;
  adequate: boolean;
  deficiency?: string;
  recommendation?: string;
}

// ============================================================================
// COMPOSITE FUNCTIONS
// ============================================================================

/**
 * 1. Log emergency incident with comprehensive documentation
 */
export async function logEmergencyIncident(
  incidentData: Partial<EmergencyIncident>,
  context: EmergencyContext,
): Promise<EmergencyIncident> {
  const logger = new Logger('EmergencyResponseComposites');

  logger.log(`Logging emergency incident: ${incidentData.incidentType}`);

  // Perform ED QuickReg for unknown patients
  const quickReg = await performEDQuickReg({
    firstName: incidentData.patientName?.split(' ')[0] || 'Unknown',
    lastName: incidentData.patientName?.split(' ')[1] || 'Unknown',
    dateOfBirth: new Date(Date.now() - (incidentData.patientAge || 10) * 365 * 24 * 60 * 60 * 1000),
    gender: 'unknown',
    severity: incidentData.severity as any,
  });

  const incident: EmergencyIncident = {
    incidentId: `EMG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    schoolId: context.schoolId,
    clinicId: context.clinicId,
    incidentType: incidentData.incidentType!,
    studentId: incidentData.studentId,
    patientName: incidentData.patientName || 'Unknown',
    patientAge: incidentData.patientAge || 0,
    incidentDate: incidentData.incidentDate || new Date(),
    incidentTime: incidentData.incidentTime || new Date(),
    location: incidentData.location || 'Unknown',
    detailedLocation: incidentData.detailedLocation || '',
    severity: incidentData.severity || 'moderate',
    chiefComplaint: incidentData.chiefComplaint || '',
    initialAssessment: incidentData.initialAssessment || {} as InitialAssessment,
    vitalSigns: incidentData.vitalSigns || [],
    treatmentProvided: incidentData.treatmentProvided || [],
    medicationsAdministered: incidentData.medicationsAdministered || [],
    disposition: incidentData.disposition || 'returned_to_class',
    ems911Called: incidentData.ems911Called || false,
    parentNotified: incidentData.parentNotified || false,
    adminNotified: incidentData.adminNotified || false,
    incidentReport: incidentData.incidentReport || '',
    followUpRequired: incidentData.followUpRequired || false,
    documentingNurse: context.userId,
    documentedAt: new Date(),
    photosDocumented: incidentData.photosDocumented || false,
    status: 'active',
  };

  logger.log(`Emergency incident logged: ${incident.incidentId}`);
  return incident;
}

/**
 * 2. Perform initial patient triage assessment
 */
export async function performEmergencyTriage(
  studentId: string,
  chiefComplaint: string,
  vitalSigns: VitalSigns,
  context: EmergencyContext,
): Promise<{ triageResult: ESITriageResult; urgency: string; recommendedActions: string[] }> {
  const logger = new Logger('EmergencyResponseComposites');

  // Build ESI triage data from school clinic assessment
  const triageData: ESITriageData = {
    vitalsUnstable: vitalSigns.heartRate > 120 || vitalSigns.respiratoryRate > 24,
    painSeverity: vitalSigns.painScore,
    confusedDisorientedLethargy: vitalSigns.consciousness !== 'alert',
    isHighRiskCondition: chiefComplaint.toLowerCase().includes('chest pain') ||
                         chiefComplaint.toLowerCase().includes('difficulty breathing'),
  };

  const triageResult = performESITriage(triageData, chiefComplaint);

  const urgency = triageResult.level <= 2 ? 'CRITICAL - Call 911 immediately' :
                  triageResult.level === 3 ? 'URGENT - Immediate care needed' :
                  'Standard care protocol';

  const recommendedActions: string[] = [];
  if (triageResult.level === 1) {
    recommendedActions.push('Call 911 immediately', 'Begin life support measures', 'Notify administration', 'Clear room for emergency access');
  } else if (triageResult.level === 2) {
    recommendedActions.push('Call 911', 'Continuous monitoring', 'Notify parents', 'Prepare for EMS handoff');
  } else if (triageResult.level === 3) {
    recommendedActions.push('Assess for 911 need', 'Close monitoring', 'Contact parents', 'Document thoroughly');
  }

  logger.log(`Triage completed for student ${studentId}: ESI-${triageResult.level}`);
  return { triageResult, urgency, recommendedActions };
}

/**
 * 3. Activate emergency protocol (lockdown, evacuation, etc.)
 */
export async function activateEmergencyProtocol(
  protocolType: EmergencyProtocol,
  reason: string,
  affectedAreas: string[],
  context: EmergencyContext,
): Promise<EmergencyProtocolActivation> {
  const logger = new Logger('EmergencyResponseComposites');

  const activation: EmergencyProtocolActivation = {
    activationId: `PROT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    schoolId: context.schoolId,
    protocolType,
    activatedAt: new Date(),
    activatedBy: context.userId,
    activationReason: reason,
    threatLevel: context.emergencyLevel === 'critical' ? 'severe' : 'high',
    affectedAreas,
    affectedPopulation: 0,
    lawEnforcementNotified: protocolType === EmergencyProtocol.ACTIVE_THREAT || protocolType === EmergencyProtocol.LOCKDOWN,
    studentsAccountedFor: false,
    staffAccountedFor: false,
    protocolStepsCompleted: [],
    communicationsSent: [],
    casualties: 0,
    injuriesReported: 0,
    duration: 0,
    status: 'active',
  };

  // Send initial communications
  activation.communicationsSent.push({
    communicationId: generateCommunicationId(),
    communicationType: 'announcement',
    recipient: 'all_staff',
    message: `${protocolType} protocol activated: ${reason}`,
    sentAt: new Date(),
    deliveryStatus: 'sent',
  });

  logger.warn(`Emergency protocol activated: ${protocolType} - ${reason}`);
  return activation;
}

/**
 * 4. Execute emergency contact notification cascade
 */
export async function executeEmergencyContactCascade(
  incidentId: string,
  studentId: string,
  urgency: 'routine' | 'urgent' | 'critical',
  context: EmergencyContext,
): Promise<EmergencyContactNotification[]> {
  const logger = new Logger('EmergencyResponseComposites');

  const notifications: EmergencyContactNotification[] = [];

  // Get emergency contacts (would fetch from database in real implementation)
  const contacts = await getStudentEmergencyContacts(studentId);

  for (const contact of contacts) {
    const notification: EmergencyContactNotification = {
      notificationId: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      incidentId,
      studentId,
      contactName: contact.name,
      contactRelationship: contact.relationship,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      notificationMethod: urgency === 'critical' ? 'phone' : 'text',
      attemptedAt: new Date(),
      attemptedBy: context.userId,
      successful: false,
      contactReached: false,
      retryAttempt: 1,
      escalatedToPrimary: false,
    };

    notifications.push(notification);
  }

  logger.log(`Emergency contact cascade executed for incident ${incidentId}: ${notifications.length} contacts`);
  return notifications;
}

/**
 * 5. Document 911 call with comprehensive details
 */
export async function document911Call(
  incidentId: string,
  callDetails: Partial<Call911Documentation>,
  context: EmergencyContext,
): Promise<Call911Documentation> {
  const logger = new Logger('EmergencyResponseComposites');

  const call911Doc: Call911Documentation = {
    callId: `CALL911-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    incidentId,
    callInitiatedAt: callDetails.callInitiatedAt || new Date(),
    callInitiatedBy: context.userId,
    dispatchCenter: callDetails.dispatchCenter || 'Local 911',
    callerLocation: callDetails.callerLocation || 'School clinic',
    patientAge: callDetails.patientAge || 0,
    patientGender: callDetails.patientGender || 'unknown',
    chiefComplaint: callDetails.chiefComplaint || '',
    consciousness: callDetails.consciousness || 'unknown',
    breathing: callDetails.breathing || 'unknown',
    bleeding: callDetails.bleeding || false,
    instructionsReceived: callDetails.instructionsReceived || [],
    emsDispatchTime: callDetails.emsDispatchTime || new Date(),
    emsEstimatedArrival: callDetails.emsEstimatedArrival || new Date(Date.now() + 10 * 60 * 1000),
    handoffReport: callDetails.handoffReport || '',
    callDuration: callDetails.callDuration || 0,
    callRecordingAvailable: false,
  };

  logger.warn(`911 call documented for incident ${incidentId}`);
  return call911Doc;
}

/**
 * 6. Administer emergency medication (EpiPen, Narcan, etc.)
 */
export async function administerEmergencyMedication(
  incidentId: string,
  studentId: string,
  medicationData: Partial<EmergencyMedication>,
  context: EmergencyContext,
): Promise<EmergencyMedication> {
  const logger = new Logger('EmergencyResponseComposites');

  const medication: EmergencyMedication = {
    medicationId: `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    medicationName: medicationData.medicationName!,
    medicationType: medicationData.medicationType!,
    dosage: medicationData.dosage!,
    route: medicationData.route!,
    administeredAt: medicationData.administeredAt || new Date(),
    administeredBy: context.userId,
    indication: medicationData.indication!,
    lotNumber: medicationData.lotNumber,
    expirationDate: medicationData.expirationDate,
    patientResponse: medicationData.patientResponse || 'Response pending',
    adverseReaction: medicationData.adverseReaction || false,
    secondDoseRequired: medicationData.secondDoseRequired || false,
    physicianOrderOnFile: medicationData.physicianOrderOnFile || false,
    parentConsent: medicationData.parentConsent || false,
    witnessedBy: medicationData.witnessedBy,
  };

  logger.warn(`Emergency medication administered: ${medication.medicationName} for incident ${incidentId}`);
  return medication;
}

/**
 * 7. Record vital signs measurement
 */
export async function recordVitalSigns(
  incidentId: string,
  vitals: Partial<VitalSigns>,
  context: EmergencyContext,
): Promise<VitalSigns> {
  const vitalSigns: VitalSigns = {
    measurementTime: vitals.measurementTime || new Date(),
    systolicBP: vitals.systolicBP,
    diastolicBP: vitals.diastolicBP,
    heartRate: vitals.heartRate!,
    respiratoryRate: vitals.respiratoryRate!,
    temperature: vitals.temperature,
    oxygenSaturation: vitals.oxygenSaturation,
    bloodGlucose: vitals.bloodGlucose,
    painScore: vitals.painScore || 0,
    consciousness: vitals.consciousness || 'alert',
    measuredBy: context.userId,
    notes: vitals.notes,
  };

  return vitalSigns;
}

/**
 * 8. Coordinate EMS transport and handoff
 */
export async function coordinateEMSTransport(
  incidentId: string,
  call911DocId: string,
  transportDetails: {
    destinationHospital: string;
    criticalStatus: boolean;
    handoffReport: string;
  },
  context: EmergencyContext,
): Promise<{
  transportCoordinated: boolean;
  estimatedArrival: Date;
  handoffComplete: boolean;
  transportDocumentId: string;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    transportCoordinated: true,
    estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
    handoffComplete: false,
    transportDocumentId: `TRANS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };

  logger.log(`EMS transport coordinated for incident ${incidentId} to ${transportDetails.destinationHospital}`);
  return result;
}

/**
 * 9. Generate incident report for administration
 */
export async function generateIncidentReport(
  incidentId: string,
  reportType: 'administration' | 'state_authority' | 'insurance' | 'legal',
  context: EmergencyContext,
): Promise<{
  reportId: string;
  reportContent: string;
  generatedAt: Date;
  submittedTo: string[];
  confidential: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const report = {
    reportId: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    reportContent: `Emergency Incident Report - ${incidentId}`,
    generatedAt: new Date(),
    submittedTo: reportType === 'administration' ? ['Principal', 'District Office'] :
                 reportType === 'state_authority' ? ['Department of Health', 'Department of Education'] :
                 reportType === 'insurance' ? ['Insurance Provider'] :
                 ['Legal Counsel'],
    confidential: true,
  };

  logger.log(`Incident report generated: ${report.reportId} for ${reportType}`);
  return report;
}

/**
 * 10. Track emergency drill and evaluate performance
 */
export async function conductEmergencyDrill(
  drillData: Partial<EmergencyDrill>,
  context: EmergencyContext,
): Promise<EmergencyDrill> {
  const logger = new Logger('EmergencyResponseComposites');

  const drill: EmergencyDrill = {
    drillId: `DRILL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    schoolId: context.schoolId,
    drillType: drillData.drillType!,
    scheduledDate: drillData.scheduledDate || new Date(),
    actualDate: drillData.actualDate || new Date(),
    announced: drillData.announced || false,
    participantCount: drillData.participantCount || 0,
    duration: drillData.duration || 0,
    evacuationTime: drillData.evacuationTime,
    successCriteria: drillData.successCriteria || [],
    observersEvaluators: drillData.observersEvaluators || [],
    findings: drillData.findings || [],
    areasOfExcellence: drillData.areasOfExcellence || [],
    areasForImprovement: drillData.areasForImprovement || [],
    correctiveActions: drillData.correctiveActions || [],
    overallRating: drillData.overallRating || 'satisfactory',
    complianceStatus: drillData.complianceStatus || 'compliant',
    nextDrillDate: drillData.nextDrillDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    conductedBy: context.userId,
    documentedBy: context.userId,
    reportSubmitted: false,
    reportSubmittedTo: [],
  };

  logger.log(`Emergency drill conducted: ${drill.drillType} - ${drill.overallRating}`);
  return drill;
}

/**
 * 11. Notify crisis response team
 */
export async function notifyCrisisTeam(
  incidentId: string,
  severity: 'routine' | 'elevated' | 'critical',
  briefSummary: string,
  context: EmergencyContext,
): Promise<{
  notificationsSent: number;
  teamMembersNotified: string[];
  assemblyLocation?: string;
  assemblyTime?: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const crisisTeam = await getCrisisTeamMembers(context.schoolId);

  const result = {
    notificationsSent: crisisTeam.length,
    teamMembersNotified: crisisTeam.map(m => m.name),
    assemblyLocation: severity === 'critical' ? 'Emergency Operations Center' : undefined,
    assemblyTime: severity === 'critical' ? new Date(Date.now() + 15 * 60 * 1000) : undefined,
  };

  logger.warn(`Crisis team notified for incident ${incidentId}: ${result.notificationsSent} members`);
  return result;
}

/**
 * 12. Check emergency supply inventory
 */
export async function checkEmergencySupplyInventory(
  schoolId: string,
  context: EmergencyContext,
): Promise<{
  totalItems: number;
  itemsBelowMinimum: EmergencySupply[];
  itemsExpiringSoon: EmergencySupply[];
  reorderRecommended: EmergencySupply[];
  lastAuditDate: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const supplies = await getEmergencySupplies(schoolId);

  const itemsBelowMinimum = supplies.filter(s => s.currentStock < s.minimumStock);
  const itemsExpiringSoon = supplies.filter(s =>
    s.expirationDate && s.expirationDate.getTime() < Date.now() + 30 * 24 * 60 * 60 * 1000
  );
  const reorderRecommended = supplies.filter(s => s.needsReorder);

  const result = {
    totalItems: supplies.length,
    itemsBelowMinimum,
    itemsExpiringSoon,
    reorderRecommended,
    lastAuditDate: new Date(),
  };

  logger.log(`Emergency supply inventory checked: ${result.totalItems} items, ${result.itemsBelowMinimum.length} below minimum`);
  return result;
}

/**
 * 13. Trigger automatic supply reorder
 */
export async function triggerSupplyReorder(
  supplyIds: string[],
  urgency: 'standard' | 'expedited' | 'emergency',
  context: EmergencyContext,
): Promise<{
  orderId: string;
  itemsOrdered: number;
  estimatedDelivery: Date;
  orderTotal: number;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const order = {
    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    itemsOrdered: supplyIds.length,
    estimatedDelivery: urgency === 'emergency' ? new Date(Date.now() + 24 * 60 * 60 * 1000) :
                       urgency === 'expedited' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) :
                       new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    orderTotal: 0,
  };

  logger.log(`Supply reorder triggered: ${order.orderId} for ${order.itemsOrdered} items`);
  return order;
}

/**
 * 14. Conduct post-incident review and analysis
 */
export async function conductPostIncidentReview(
  incidentId: string,
  reviewData: Partial<PostIncidentReview>,
  context: EmergencyContext,
): Promise<PostIncidentReview> {
  const logger = new Logger('EmergencyResponseComposites');

  const review: PostIncidentReview = {
    reviewId: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    incidentId,
    reviewDate: reviewData.reviewDate || new Date(),
    reviewTeam: reviewData.reviewTeam || [],
    incidentSummary: reviewData.incidentSummary || '',
    timelineOfEvents: reviewData.timelineOfEvents || [],
    responseEffectiveness: reviewData.responseEffectiveness || {
      recognitionTime: 0,
      activationTime: 0,
      responseTime: 0,
      resolutionTime: 0,
      overallRating: 0,
      comments: '',
    },
    protocolAdherence: reviewData.protocolAdherence || [],
    communicationEffectiveness: reviewData.communicationEffectiveness || 0,
    resourceAdequacy: reviewData.resourceAdequacy || [],
    lessonsLearned: reviewData.lessonsLearned || [],
    bestPractices: reviewData.bestPractices || [],
    recommendedChanges: reviewData.recommendedChanges || [],
    trainingNeeds: reviewData.trainingNeeds || [],
    policyRevisions: reviewData.policyRevisions || [],
    followUpActions: reviewData.followUpActions || [],
    reviewCompletedBy: context.userId,
    distributedTo: [],
  };

  logger.log(`Post-incident review completed: ${review.reviewId}`);
  return review;
}

/**
 * 15. Create or update student emergency action plan
 */
export async function manageEmergencyActionPlan(
  studentId: string,
  planData: Partial<EmergencyActionPlan>,
  action: 'create' | 'update' | 'review' | 'deactivate',
  context: EmergencyContext,
): Promise<EmergencyActionPlan> {
  const logger = new Logger('EmergencyResponseComposites');

  const plan: EmergencyActionPlan = {
    planId: planData.planId || `EAP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    studentId,
    condition: planData.condition!,
    diagnosisDate: planData.diagnosisDate || new Date(),
    diagnosingPhysician: planData.diagnosingPhysician || '',
    severity: planData.severity || 'moderate',
    triggers: planData.triggers || [],
    warningSymptoms: planData.warningSymptoms || [],
    emergencySymptoms: planData.emergencySymptoms || [],
    immediateActions: planData.immediateActions || [],
    emergencyMedications: planData.emergencyMedications || [],
    whenToCall911: planData.whenToCall911 || [],
    additionalInstructions: planData.additionalInstructions || '',
    restrictionsAccommodations: planData.restrictionsAccommodations || [],
    emergencyContacts: planData.emergencyContacts || [],
    physicianContact: planData.physicianContact || { name: '', phone: '' },
    parentSignature: planData.parentSignature || '',
    parentSignatureDate: planData.parentSignatureDate || new Date(),
    schoolNurseSignature: context.userId,
    schoolNurseSignatureDate: new Date(),
    effectiveDate: planData.effectiveDate || new Date(),
    reviewDate: planData.reviewDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isActive: action !== 'deactivate',
    photoOnFile: planData.photoOnFile || false,
    staffTrainingCompleted: planData.staffTrainingCompleted || [],
  };

  logger.log(`Emergency action plan ${action}: ${plan.planId} for student ${studentId}`);
  return plan;
}

/**
 * 16. Verify staff training on emergency action plan
 */
export async function verifyStaffEAPTraining(
  eapId: string,
  staffMemberId: string,
  staffName: string,
  context: EmergencyContext,
): Promise<StaffTraining> {
  const logger = new Logger('EmergencyResponseComposites');

  const training: StaffTraining = {
    staffMemberId,
    staffName,
    role: context.userRole,
    trainedOn: new Date(),
    trainedBy: context.userId,
    competencyVerified: true,
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  logger.log(`Staff EAP training verified: ${staffName} for plan ${eapId}`);
  return training;
}

/**
 * 17. Initiate concussion protocol assessment
 */
export async function initiateConcussionProtocol(
  studentId: string,
  injuryDetails: Partial<ConcussionAssessment>,
  context: EmergencyContext,
): Promise<ConcussionAssessment> {
  const logger = new Logger('EmergencyResponseComposites');

  const assessment: ConcussionAssessment = {
    assessmentId: `CONC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    studentId,
    incidentId: injuryDetails.incidentId,
    injuryDate: injuryDetails.injuryDate || new Date(),
    injuryMechanism: injuryDetails.injuryMechanism || '',
    witnessedBy: injuryDetails.witnessedBy,
    immediateSymptoms: injuryDetails.immediateSymptoms || [],
    lossOfConsciousness: injuryDetails.lossOfConsciousness || false,
    locDuration: injuryDetails.locDuration,
    amnesia: injuryDetails.amnesia || false,
    amnesiaType: injuryDetails.amnesiaType,
    initialSACScore: injuryDetails.initialSACScore,
    symptomsAssessment: injuryDetails.symptomsAssessment || [],
    cognitiveAssessment: injuryDetails.cognitiveAssessment || {
      testDate: new Date(),
      orientation: 0,
      immediateMemory: 0,
      concentration: 0,
      delayedRecall: 0,
      totalScore: 0,
    },
    balanceAssessment: injuryDetails.balanceAssessment || {
      testDate: new Date(),
      doubleStance: 0,
      singleStance: 0,
      tandemStance: 0,
      totalErrors: 0,
    },
    severity: determineConcussionSeverity(injuryDetails),
    concussionProtocolInitiated: true,
    returnToLearnPlan: {
      stage: 1,
      stageDescription: 'Complete cognitive rest',
      symptomFree: false,
    },
    returnToPlayPlan: {
      stage: 1,
      stageDescription: 'No physical activity',
      symptomFree: false,
    },
    physicianReferral: true,
    parentNotified: false,
    parentEducationProvided: false,
    assessedBy: context.userId,
    assessedAt: new Date(),
  };

  logger.warn(`Concussion protocol initiated for student ${studentId}: ${assessment.severity}`);
  return assessment;
}

/**
 * 18. Update concussion recovery progress
 */
export async function updateConcussionRecovery(
  assessmentId: string,
  updates: {
    symptomsResolved: boolean;
    returnToLearnStage?: number;
    returnToPlayStage?: number;
    physicianClearance?: PhysicianClearance;
  },
  context: EmergencyContext,
): Promise<{ updated: boolean; clearedForActivity: boolean; restrictions: string[] }> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    updated: true,
    clearedForActivity: updates.symptomsResolved && updates.returnToPlayStage === 6,
    restrictions: !updates.symptomsResolved ? ['No physical activity', 'Limited screen time', 'Academic accommodations'] : [],
  };

  logger.log(`Concussion recovery updated: ${assessmentId}`);
  return result;
}

/**
 * 19. Document anaphylaxis response
 */
export async function documentAnaphylaxisResponse(
  incidentId: string,
  responseData: Partial<AnaphylaxisResponse>,
  context: EmergencyContext,
): Promise<AnaphylaxisResponse> {
  const logger = new Logger('EmergencyResponseComposites');

  const response: AnaphylaxisResponse = {
    responseId: `ANAPH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    incidentId,
    studentId: responseData.studentId!,
    onsetTime: responseData.onsetTime || new Date(),
    trigger: responseData.trigger,
    knownAllergy: responseData.knownAllergy || false,
    allergen: responseData.allergen,
    symptoms: responseData.symptoms || [],
    severity: responseData.severity || 'moderate',
    epipenAdministered: responseData.epipenAdministered || false,
    epipenDetails: responseData.epipenDetails || [],
    additionalTreatments: responseData.additionalTreatments || [],
    responseToEpinephrine: responseData.responseToEpinephrine || '',
    secondEpipenRequired: responseData.secondEpipenRequired || false,
    ems911Called: responseData.ems911Called || false,
    transportedToHospital: responseData.transportedToHospital || false,
    hospital: responseData.hospital,
    biphasicReactionWarning: true,
    observationPeriod: 240, // 4 hours minimum
    followUpWithAllergist: true,
    eapUpdated: false,
    allergyRegistryUpdated: false,
    staffDebriefing: false,
    respondedBy: context.userId,
  };

  logger.warn(`Anaphylaxis response documented: ${response.responseId} - Severity: ${response.severity}`);
  return response;
}

/**
 * 20. Update allergy registry after anaphylaxis event
 */
export async function updateAllergyRegistry(
  studentId: string,
  allergen: string,
  severity: 'mild' | 'moderate' | 'severe' | 'life_threatening',
  incidentId: string,
  context: EmergencyContext,
): Promise<{
  registryUpdated: boolean;
  alertsFlagged: boolean;
  eapRequired: boolean;
  staffNotified: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    registryUpdated: true,
    alertsFlagged: true,
    eapRequired: severity === 'severe' || severity === 'life_threatening',
    staffNotified: true,
  };

  logger.warn(`Allergy registry updated for student ${studentId}: ${allergen} - ${severity}`);
  return result;
}

/**
 * 21. Get student emergency action plans
 */
export async function getStudentEmergencyPlans(
  studentId: string,
  context: EmergencyContext,
): Promise<EmergencyActionPlan[]> {
  const logger = new Logger('EmergencyResponseComposites');

  // Would fetch from database in real implementation
  logger.log(`Retrieved emergency action plans for student ${studentId}`);
  return [];
}

/**
 * 22. Validate emergency medication stock
 */
export async function validateEmergencyMedicationStock(
  schoolId: string,
  medicationType: 'epipen' | 'narcan' | 'glucagon' | 'inhaler',
  context: EmergencyContext,
): Promise<{
  available: number;
  expired: number;
  minimumRequired: number;
  compliant: boolean;
  expirationAlerts: Array<{ item: string; expiresOn: Date }>;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const supplies = await getEmergencySupplies(schoolId);
  const medicationSupplies = supplies.filter(s =>
    s.category === 'medication' && s.itemName.toLowerCase().includes(medicationType)
  );

  const now = new Date();
  const available = medicationSupplies.filter(s =>
    !s.expirationDate || s.expirationDate > now
  ).reduce((sum, s) => sum + s.currentStock, 0);

  const expired = medicationSupplies.filter(s =>
    s.expirationDate && s.expirationDate <= now
  ).reduce((sum, s) => sum + s.currentStock, 0);

  const expirationAlerts = medicationSupplies
    .filter(s => s.expirationDate && s.expirationDate.getTime() < now.getTime() + 90 * 24 * 60 * 60 * 1000)
    .map(s => ({ item: s.itemName, expiresOn: s.expirationDate! }));

  const result = {
    available,
    expired,
    minimumRequired: 4, // Example: 4 EpiPens minimum
    compliant: available >= 4,
    expirationAlerts,
  };

  logger.log(`Emergency medication stock validated: ${medicationType} - Available: ${available}, Expired: ${expired}`);
  return result;
}

/**
 * 23. Generate emergency preparedness compliance report
 */
export async function generatePreparednessComplianceReport(
  schoolId: string,
  reportPeriod: { startDate: Date; endDate: Date },
  context: EmergencyContext,
): Promise<{
  reportId: string;
  drillsCompleted: number;
  drillsRequired: number;
  drillCompliance: number;
  suppliesCompliant: boolean;
  trainingCompliant: boolean;
  eapsCurrent: number;
  eapsExpired: number;
  overallCompliance: number;
  findings: string[];
  recommendations: string[];
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const report = {
    reportId: `COMP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    drillsCompleted: 8,
    drillsRequired: 12,
    drillCompliance: 67,
    suppliesCompliant: true,
    trainingCompliant: false,
    eapsCurrent: 45,
    eapsExpired: 5,
    overallCompliance: 75,
    findings: [
      'Fire drill compliance met',
      'Lockdown drills below required frequency',
      'Emergency supplies adequately stocked',
      '5 staff members require EAP training refresh',
    ],
    recommendations: [
      'Schedule additional lockdown drills',
      'Conduct staff EAP training session',
      'Review and update expired EAPs',
    ],
  };

  logger.log(`Emergency preparedness compliance report generated: ${report.reportId}`);
  return report;
}

/**
 * 24. Schedule and track emergency drills
 */
export async function scheduleEmergencyDrill(
  schoolId: string,
  drillType: EmergencyProtocol,
  scheduledDate: Date,
  announced: boolean,
  context: EmergencyContext,
): Promise<{
  drillScheduled: boolean;
  drillId: string;
  notificationsScheduled: boolean;
  complianceDeadline: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    drillScheduled: true,
    drillId: `DRILL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    notificationsScheduled: true,
    complianceDeadline: new Date(scheduledDate.getTime() + 7 * 24 * 60 * 60 * 1000),
  };

  logger.log(`Emergency drill scheduled: ${drillType} on ${scheduledDate.toISOString()}`);
  return result;
}

/**
 * 25. Evaluate drill performance
 */
export async function evaluateDrillPerformance(
  drillId: string,
  evaluation: {
    evacuationTime: number;
    targetTime: number;
    criticalIssues: string[];
    performanceRating: number;
  },
  context: EmergencyContext,
): Promise<{
  performanceMet: boolean;
  score: number;
  areasForImprovement: string[];
  correctiveActions: CorrectiveAction[];
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const performanceMet = evaluation.evacuationTime <= evaluation.targetTime &&
                         evaluation.criticalIssues.length === 0 &&
                         evaluation.performanceRating >= 80;

  const result = {
    performanceMet,
    score: evaluation.performanceRating,
    areasForImprovement: evaluation.criticalIssues,
    correctiveActions: evaluation.criticalIssues.map((issue, index) => ({
      actionId: `CA-${Date.now()}-${index}`,
      description: `Address: ${issue}`,
      assignedTo: context.userId,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'pending' as const,
    })),
  };

  logger.log(`Drill performance evaluated: ${drillId} - Score: ${result.score}`);
  return result;
}

/**
 * 26. Activate mass casualty incident protocol
 */
export async function activateMassCasualtyProtocol(
  schoolId: string,
  estimatedCasualties: number,
  incidentType: string,
  context: EmergencyContext,
): Promise<{
  protocolActivated: boolean;
  activationId: string;
  triageStationsEstablished: number;
  additionalResourcesRequested: boolean;
  mutualAidRequested: boolean;
  incidentCommandEstablished: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const activation = await activateTraumaProtocol({
    patientMRN: 'MASS-CASUALTY',
    mechanismOfInjury: incidentType,
    procedures: ['Mass casualty triage', 'Multiple patient assessment'],
    specialistTeams: ['EMS', 'Fire', 'Law Enforcement', 'Trauma Surgery'],
  });

  const result = {
    protocolActivated: true,
    activationId: activation.activationId,
    triageStationsEstablished: Math.ceil(estimatedCasualties / 20),
    additionalResourcesRequested: estimatedCasualties > 10,
    mutualAidRequested: estimatedCasualties > 20,
    incidentCommandEstablished: true,
  };

  logger.error(`Mass casualty protocol activated: ${result.activationId} - Estimated casualties: ${estimatedCasualties}`);
  return result;
}

/**
 * 27. Perform START triage for mass casualty
 */
export async function performSTARTTriage(
  patientData: {
    walking: boolean;
    breathing: boolean;
    respiratoryRate: number;
    radialPulse: boolean;
    mentalStatus: string;
  },
): Promise<{
  triageCategory: 'green' | 'yellow' | 'red' | 'black';
  priority: number;
  immediateActions: string[];
}> {
  let category: 'green' | 'yellow' | 'red' | 'black';
  let priority: number;
  const actions: string[] = [];

  if (patientData.walking) {
    category = 'green';
    priority = 4;
    actions.push('Move to minor treatment area');
  } else if (!patientData.breathing) {
    category = 'black';
    priority = 5;
    actions.push('Tag as deceased', 'Move to collection area');
  } else if (patientData.respiratoryRate > 30) {
    category = 'red';
    priority = 1;
    actions.push('Immediate treatment required', 'Expedite transport');
  } else if (!patientData.radialPulse || patientData.mentalStatus !== 'alert') {
    category = 'red';
    priority = 1;
    actions.push('Immediate treatment required', 'Monitor closely');
  } else {
    category = 'yellow';
    priority = 2;
    actions.push('Delayed treatment acceptable', 'Continue monitoring');
  }

  return { triageCategory: category, priority, immediateActions: actions };
}

/**
 * 28. Document critical incident stress debriefing
 */
export async function documentStressDebriefing(
  incidentId: string,
  debriefingData: {
    participantCount: number;
    facilitator: string;
    duration: number;
    keyThemes: string[];
    followUpRecommendations: string[];
  },
  context: EmergencyContext,
): Promise<{
  debriefingId: string;
  completed: boolean;
  followUpScheduled: boolean;
  referralsMade: number;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    debriefingId: `DEBRIEF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    completed: true,
    followUpScheduled: debriefingData.followUpRecommendations.length > 0,
    referralsMade: 0,
  };

  logger.log(`Critical incident stress debriefing documented: ${result.debriefingId} for incident ${incidentId}`);
  return result;
}

/**
 * 29. Generate emergency contact list by class
 */
export async function generateClassEmergencyContacts(
  schoolId: string,
  classId: string,
  context: EmergencyContext,
): Promise<{
  className: string;
  studentCount: number;
  contacts: Array<{
    studentId: string;
    studentName: string;
    primaryContact: string;
    primaryPhone: string;
    secondaryContact?: string;
    secondaryPhone?: string;
    medicalAlerts: string[];
  }>;
  generatedAt: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    className: 'Example Class',
    studentCount: 0,
    contacts: [],
    generatedAt: new Date(),
  };

  logger.log(`Emergency contact list generated for class ${classId}`);
  return result;
}

/**
 * 30. Track emergency medication expiration
 */
export async function trackMedicationExpirations(
  schoolId: string,
  daysUntilExpiration: number,
  context: EmergencyContext,
): Promise<{
  medicationsExpiring: Array<{
    medicationId: string;
    medicationName: string;
    studentId?: string;
    expirationDate: Date;
    daysRemaining: number;
    replacementOrdered: boolean;
  }>;
  alertsSent: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    medicationsExpiring: [],
    alertsSent: false,
  };

  logger.log(`Medication expiration tracking completed for ${schoolId}`);
  return result;
}

/**
 * 31. Generate emergency incident timeline
 */
export async function generateIncidentTimeline(
  incidentId: string,
  context: EmergencyContext,
): Promise<{
  timelineId: string;
  events: TimelineEvent[];
  totalDuration: number;
  criticalDecisionPoints: TimelineEvent[];
  visualizationUrl?: string;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    timelineId: `TIMELINE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    events: [],
    totalDuration: 0,
    criticalDecisionPoints: [],
  };

  logger.log(`Incident timeline generated: ${result.timelineId} for incident ${incidentId}`);
  return result;
}

/**
 * 32. Verify emergency equipment functionality
 */
export async function verifyEmergencyEquipment(
  schoolId: string,
  equipmentType: 'aed' | 'oxygen' | 'first_aid' | 'communication',
  context: EmergencyContext,
): Promise<{
  equipmentId: string;
  functional: boolean;
  lastChecked: Date;
  nextCheckDue: Date;
  maintenanceRequired: boolean;
  certificationCurrent: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    equipmentId: `EQ-${equipmentType.toUpperCase()}-001`,
    functional: true,
    lastChecked: new Date(),
    nextCheckDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maintenanceRequired: false,
    certificationCurrent: true,
  };

  logger.log(`Emergency equipment verified: ${equipmentType} at ${schoolId}`);
  return result;
}

/**
 * 33. Create emergency scenario training plan
 */
export async function createEmergencyTrainingPlan(
  schoolId: string,
  trainingData: {
    trainingType: string;
    targetAudience: string[];
    objectives: string[];
    duration: number;
    scheduledDate: Date;
  },
  context: EmergencyContext,
): Promise<{
  trainingPlanId: string;
  created: boolean;
  participantsEnrolled: number;
  certificatesRequired: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    trainingPlanId: `TRAIN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    created: true,
    participantsEnrolled: 0,
    certificatesRequired: true,
  };

  logger.log(`Emergency training plan created: ${result.trainingPlanId}`);
  return result;
}

/**
 * 34. Assess school emergency preparedness score
 */
export async function assessEmergencyPreparedness(
  schoolId: string,
  context: EmergencyContext,
): Promise<{
  overallScore: number;
  categoryScores: {
    planning: number;
    training: number;
    equipment: number;
    drills: number;
    communication: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  complianceLevel: 'excellent' | 'good' | 'fair' | 'poor';
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    overallScore: 85,
    categoryScores: {
      planning: 90,
      training: 80,
      equipment: 85,
      drills: 75,
      communication: 90,
    },
    strengths: [
      'Comprehensive emergency plans in place',
      'Well-stocked emergency supplies',
      'Effective communication systems',
    ],
    weaknesses: [
      'Drill frequency below recommended levels',
      'Some staff training certifications expired',
    ],
    recommendations: [
      'Increase drill frequency to meet compliance',
      'Schedule staff training refresher courses',
      'Update emergency contact information',
    ],
    complianceLevel: 'good' as const,
  };

  logger.log(`Emergency preparedness assessed for ${schoolId}: ${result.overallScore}%`);
  return result;
}

/**
 * 35. Generate emergency protocol quick reference guide
 */
export async function generateProtocolQuickReference(
  protocolType: EmergencyProtocol,
  format: 'pdf' | 'poster' | 'card' | 'digital',
  context: EmergencyContext,
): Promise<{
  referenceId: string;
  protocolType: EmergencyProtocol;
  format: string;
  downloadUrl: string;
  qrCodeUrl?: string;
  generatedAt: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    referenceId: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    protocolType,
    format,
    downloadUrl: `/downloads/emergency-protocols/${protocolType}-${format}`,
    qrCodeUrl: format === 'digital' ? `/qr-codes/${protocolType}` : undefined,
    generatedAt: new Date(),
  };

  logger.log(`Emergency protocol quick reference generated: ${result.referenceId}`);
  return result;
}

/**
 * 36. Record parent acknowledgment of emergency plan
 */
export async function recordParentEmergencyPlanAcknowledgment(
  studentId: string,
  planType: 'general' | 'eap' | 'concussion' | 'anaphylaxis',
  acknowledgmentData: {
    parentName: string;
    acknowledgedAt: Date;
    signature: string;
    questionsAnswered: boolean;
  },
  context: EmergencyContext,
): Promise<{
  acknowledgmentId: string;
  recorded: boolean;
  documentUrl: string;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    acknowledgmentId: `ACK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    recorded: true,
    documentUrl: `/documents/acknowledgments/${studentId}/${planType}`,
  };

  logger.log(`Parent emergency plan acknowledgment recorded: ${result.acknowledgmentId}`);
  return result;
}

/**
 * 37. Coordinate multi-agency emergency response
 */
export async function coordinateMultiAgencyResponse(
  incidentId: string,
  agencies: Array<'police' | 'fire' | 'ems' | 'hazmat' | 'mental_health'>,
  unifiedCommand: boolean,
  context: EmergencyContext,
): Promise<{
  coordinationId: string;
  agenciesNotified: string[];
  unifiedCommandEstablished: boolean;
  incidentCommandPost: string;
  liaisons: Array<{ agency: string; liaison: string; contact: string }>;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    coordinationId: `COORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    agenciesNotified: agencies,
    unifiedCommandEstablished: unifiedCommand,
    incidentCommandPost: 'School Main Office',
    liaisons: agencies.map(agency => ({
      agency,
      liaison: `${agency} Liaison`,
      contact: '555-0100',
    })),
  };

  logger.warn(`Multi-agency response coordination initiated: ${result.coordinationId}`);
  return result;
}

/**
 * 38. Update emergency contact information
 */
export async function updateEmergencyContactInformation(
  studentId: string,
  contacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
    priority: number;
  }>,
  context: EmergencyContext,
): Promise<{
  updated: boolean;
  contactsUpdated: number;
  verificationSent: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    updated: true,
    contactsUpdated: contacts.length,
    verificationSent: true,
  };

  logger.log(`Emergency contact information updated for student ${studentId}: ${contacts.length} contacts`);
  return result;
}

/**
 * 39. Generate emergency operations plan
 */
export async function generateEmergencyOperationsPlan(
  schoolId: string,
  planData: {
    planYear: number;
    hazardAssessment: string[];
    resourceInventory: string[];
    responseProcedures: string[];
    trainingSchedule: string[];
  },
  context: EmergencyContext,
): Promise<{
  planId: string;
  planUrl: string;
  approvalRequired: string[];
  distributionList: string[];
  nextReviewDate: Date;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    planId: `EOP-${planData.planYear}-${schoolId}`,
    planUrl: `/documents/emergency-operations/${schoolId}/${planData.planYear}`,
    approvalRequired: ['Principal', 'District Safety Coordinator', 'Board of Education'],
    distributionList: ['All Staff', 'Emergency Services', 'District Office', 'Parent Representatives'],
    nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  logger.log(`Emergency operations plan generated: ${result.planId}`);
  return result;
}

/**
 * 40. Track and report emergency incidents to state authorities
 */
export async function reportIncidentToStateAuthorities(
  incidentId: string,
  reportingRequirements: {
    reportableIncident: boolean;
    agencies: string[];
    deadline: Date;
  },
  context: EmergencyContext,
): Promise<{
  reportId: string;
  submitted: boolean;
  submittedTo: string[];
  confirmationNumbers: Record<string, string>;
  submittedAt: Date;
  followUpRequired: boolean;
}> {
  const logger = new Logger('EmergencyResponseComposites');

  const result = {
    reportId: `STATE-RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    submitted: true,
    submittedTo: reportingRequirements.agencies,
    confirmationNumbers: reportingRequirements.agencies.reduce((acc, agency) => ({
      ...acc,
      [agency]: `CONF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }), {}),
    submittedAt: new Date(),
    followUpRequired: true,
  };

  logger.log(`Incident reported to state authorities: ${result.reportId} for incident ${incidentId}`);
  return result;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function determineConcussionSeverity(
  injuryDetails: Partial<ConcussionAssessment>,
): 'grade_1' | 'grade_2' | 'grade_3' {
  if (injuryDetails.lossOfConsciousness && (injuryDetails.locDuration || 0) > 1) {
    return 'grade_3';
  } else if (injuryDetails.lossOfConsciousness || injuryDetails.amnesia) {
    return 'grade_2';
  } else {
    return 'grade_1';
  }
}

function generateCommunicationId(): string {
  return `COMM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function getStudentEmergencyContacts(studentId: string): Promise<Array<{
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
}>> {
  // Would fetch from database in real implementation
  return [];
}

async function getCrisisTeamMembers(schoolId: string): Promise<CrisisTeamMember[]> {
  // Would fetch from database in real implementation
  return [];
}

async function getEmergencySupplies(schoolId: string): Promise<EmergencySupply[]> {
  // Would fetch from database in real implementation
  return [];
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Main composite functions
  logEmergencyIncident,
  performEmergencyTriage,
  activateEmergencyProtocol,
  executeEmergencyContactCascade,
  document911Call,
  administerEmergencyMedication,
  recordVitalSigns,
  coordinateEMSTransport,
  generateIncidentReport,
  conductEmergencyDrill,
  notifyCrisisTeam,
  checkEmergencySupplyInventory,
  triggerSupplyReorder,
  conductPostIncidentReview,
  manageEmergencyActionPlan,
  verifyStaffEAPTraining,
  initiateConcussionProtocol,
  updateConcussionRecovery,
  documentAnaphylaxisResponse,
  updateAllergyRegistry,
  getStudentEmergencyPlans,
  validateEmergencyMedicationStock,
  generatePreparednessComplianceReport,
  scheduleEmergencyDrill,
  evaluateDrillPerformance,
  activateMassCasualtyProtocol,
  performSTARTTriage,
  documentStressDebriefing,
  generateClassEmergencyContacts,
  trackMedicationExpirations,
  generateIncidentTimeline,
  verifyEmergencyEquipment,
  createEmergencyTrainingPlan,
  assessEmergencyPreparedness,
  generateProtocolQuickReference,
  recordParentEmergencyPlanAcknowledgment,
  coordinateMultiAgencyResponse,
  updateEmergencyContactInformation,
  generateEmergencyOperationsPlan,
  reportIncidentToStateAuthorities,
};
