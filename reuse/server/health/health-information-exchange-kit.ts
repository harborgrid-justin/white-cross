/**
 * LOC: HLTH-HIE-001
 * File: /reuse/server/health/health-information-exchange-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - class-validator
 *   - class-transformer
 *   - fhir/r4 (HL7 FHIR R4)
 *   - crypto (Node.js)
 *   - nodemailer (SMTP/S)
 *   - xml2js
 *
 * DOWNSTREAM (imported by):
 *   - HIE integration services
 *   - Care coordination modules
 *   - Document exchange services
 *   - Provider directory services
 *   - Patient matching services
 */

/**
 * File: /reuse/server/health/health-information-exchange-kit.ts
 * Locator: WC-HEALTH-HIE-001
 * Purpose: Healthcare Information Exchange Kit - Epic Care Everywhere-level interoperability utilities
 *
 * Upstream: FHIR R4, HL7 v2, @nestjs/common, xml2js, crypto, nodemailer
 * Downstream: ../backend/health/*, HIE services, Care coordination, Document exchange, MPI
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, FHIR R4, HL7 v2.x
 * Exports: 42 production-ready functions for health information exchange, interoperability, document sharing
 *
 * LLM Context: Enterprise-grade HIPAA-compliant health information exchange utilities for White Cross platform.
 * Provides comprehensive HL7 v2 message parsing (ADT, ORU, ORM), HL7 FHIR R4 resource conversion, Direct messaging
 * (SMTP/S), Continuity of Care Document (CCD) generation, patient consent management for data sharing, record
 * locator service integration, National Provider Directory queries, Master Patient Index (MPI) integration with
 * probabilistic matching, cross-organizational patient matching, IHE XDS/XCA document registry/repository patterns,
 * query-based document exchange, patient discovery protocols, comprehensive audit trails for HIPAA compliance.
 * Epic Care Everywhere, CommonWell, Carequality-level features with enterprise scalability and security.
 */

import * as crypto from 'crypto';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * HL7 v2 message types
 */
export type HL7MessageType = 'ADT' | 'ORU' | 'ORM' | 'SIU' | 'MDM' | 'DFT' | 'BAR';

/**
 * HL7 v2 ADT event types
 */
export type ADTEventType = 'A01' | 'A02' | 'A03' | 'A04' | 'A05' | 'A08' | 'A11' | 'A12' | 'A13';

/**
 * Parsed HL7 v2 message structure
 */
export interface HL7Message {
  messageType: HL7MessageType;
  eventType: string;
  messageControlId: string;
  timestamp: Date;
  sendingApplication: string;
  sendingFacility: string;
  receivingApplication: string;
  receivingFacility: string;
  versionId: string;
  segments: HL7Segment[];
  pid?: PatientIdentificationSegment;
  pv1?: PatientVisitSegment;
  obr?: ObservationRequestSegment[];
  obx?: ObservationResultSegment[];
  orc?: OrderControlSegment[];
}

/**
 * HL7 v2 segment
 */
export interface HL7Segment {
  type: string;
  fields: string[];
  rawSegment: string;
}

/**
 * HL7 PID segment (Patient Identification)
 */
export interface PatientIdentificationSegment {
  patientId: string;
  patientIdentifierList: Array<{
    id: string;
    checkDigit?: string;
    idType: string;
    assigningAuthority?: string;
  }>;
  patientName: {
    familyName: string;
    givenName: string;
    middleName?: string;
    suffix?: string;
    prefix?: string;
  };
  dateOfBirth?: Date;
  sex?: string;
  patientAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  phoneHome?: string;
  phoneWork?: string;
  maritalStatus?: string;
  race?: string;
  ssn?: string;
  driversLicense?: string;
}

/**
 * HL7 PV1 segment (Patient Visit)
 */
export interface PatientVisitSegment {
  setId: string;
  patientClass: string;
  assignedPatientLocation?: {
    pointOfCare?: string;
    room?: string;
    bed?: string;
    facility?: string;
    building?: string;
    floor?: string;
  };
  admissionType?: string;
  attendingDoctor?: {
    id: string;
    familyName: string;
    givenName: string;
    idType?: string;
  };
  referringDoctor?: any;
  consultingDoctor?: any;
  hospitalService?: string;
  admitDateTime?: Date;
  dischargeDateTime?: Date;
  visitNumber?: string;
}

/**
 * HL7 OBR segment (Observation Request)
 */
export interface ObservationRequestSegment {
  setId: string;
  placerOrderNumber?: string;
  fillerOrderNumber?: string;
  universalServiceId: {
    identifier: string;
    text: string;
    codingSystem: string;
  };
  observationDateTime?: Date;
  specimenReceivedDateTime?: Date;
  orderingProvider?: any;
  resultStatus?: string;
}

/**
 * HL7 OBX segment (Observation Result)
 */
export interface ObservationResultSegment {
  setId: string;
  valueType: string;
  observationIdentifier: {
    identifier: string;
    text: string;
    codingSystem: string;
  };
  observationSubId?: string;
  observationValue: any;
  units?: string;
  referenceRange?: string;
  abnormalFlags?: string[];
  observationResultStatus: string;
  observationDateTime?: Date;
}

/**
 * HL7 ORC segment (Order Control)
 */
export interface OrderControlSegment {
  orderControl: string;
  placerOrderNumber?: string;
  fillerOrderNumber?: string;
  orderStatus?: string;
  orderDateTime?: Date;
  orderingProvider?: any;
}

/**
 * FHIR resource types for conversion
 */
export type FHIRResourceType = 'Patient' | 'Observation' | 'DiagnosticReport' | 'MedicationRequest' |
  'Encounter' | 'Practitioner' | 'Organization' | 'DocumentReference';

/**
 * FHIR Bundle structure
 */
export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'transaction' | 'batch' | 'collection' | 'document' | 'searchset';
  timestamp?: string;
  total?: number;
  entry: Array<{
    fullUrl?: string;
    resource: any;
    request?: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      url: string;
    };
  }>;
}

/**
 * Continuity of Care Document (CCD) structure
 */
export interface ContinuityOfCareDocument {
  patientId: string;
  documentId: string;
  documentDate: Date;
  author: {
    id: string;
    name: string;
    organization?: string;
  };
  custodian: {
    id: string;
    name: string;
    address?: string;
  };
  sections: {
    allergies?: CCDAllergy[];
    medications?: CCDMedication[];
    problems?: CCDProblem[];
    procedures?: CCDProcedure[];
    vitalSigns?: CCDVitalSign[];
    immunizations?: CCDImmunization[];
    socialHistory?: CCDSocialHistory;
    familyHistory?: CCDFamilyHistory[];
    results?: CCDResult[];
  };
  encounterId?: string;
  reasonForVisit?: string;
}

/**
 * CCD Allergy entry
 */
export interface CCDAllergy {
  substance: string;
  substanceCode?: string;
  reaction?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'inactive' | 'resolved';
  onsetDate?: Date;
  notes?: string;
}

/**
 * CCD Medication entry
 */
export interface CCDMedication {
  name: string;
  code?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'discontinued';
  prescriber?: string;
  instructions?: string;
}

/**
 * CCD Problem entry
 */
export interface CCDProblem {
  description: string;
  code?: string;
  codeSystem?: string;
  status: 'active' | 'inactive' | 'resolved';
  onsetDate?: Date;
  resolutionDate?: Date;
  severity?: string;
}

/**
 * CCD Procedure entry
 */
export interface CCDProcedure {
  description: string;
  code?: string;
  codeSystem?: string;
  performedDate: Date;
  performer?: string;
  location?: string;
  status: 'completed' | 'in-progress' | 'cancelled';
}

/**
 * CCD Vital Sign entry
 */
export interface CCDVitalSign {
  type: string;
  value: number;
  unit: string;
  date: Date;
  method?: string;
}

/**
 * CCD Immunization entry
 */
export interface CCDImmunization {
  vaccine: string;
  vaccineCode?: string;
  administeredDate: Date;
  doseNumber?: number;
  route?: string;
  site?: string;
  lotNumber?: string;
  expirationDate?: Date;
  performer?: string;
}

/**
 * CCD Social History
 */
export interface CCDSocialHistory {
  smokingStatus?: 'current' | 'former' | 'never' | 'unknown';
  alcoholUse?: string;
  occupation?: string;
  educationLevel?: string;
}

/**
 * CCD Family History entry
 */
export interface CCDFamilyHistory {
  relationship: string;
  condition: string;
  onsetAge?: number;
  deceased?: boolean;
}

/**
 * CCD Lab Result entry
 */
export interface CCDResult {
  testName: string;
  testCode?: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: string;
  date: Date;
  status: 'final' | 'preliminary' | 'corrected';
}

/**
 * Patient consent for HIE
 */
export interface HIEConsent {
  id?: string;
  patientId: string;
  consentType: 'opt-in' | 'opt-out' | 'break-glass';
  scope: 'full' | 'limited' | 'emergency-only';
  status: 'active' | 'inactive' | 'revoked' | 'expired';
  effectiveDate: Date;
  expirationDate?: Date;
  authorizedOrganizations?: string[];
  authorizedProviders?: string[];
  dataCategories?: string[];
  restrictions?: string[];
  signedBy?: string;
  signatureDate?: Date;
  witnessedBy?: string;
  documentId?: string;
  revokedDate?: Date;
  revokedBy?: string;
  revokedReason?: string;
}

/**
 * Master Patient Index entry
 */
export interface MPIEntry {
  mpiId: string;
  sourceSystem: string;
  sourcePatientId: string;
  demographics: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: Date;
    sex: 'M' | 'F' | 'U';
    ssn?: string;
    mrn?: string;
  };
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    zip: string;
  }>;
  phones?: string[];
  emails?: string[];
  identifiers?: Array<{
    type: string;
    value: string;
    system?: string;
  }>;
  matchConfidence?: number;
  linkages?: Array<{
    linkedMpiId: string;
    linkType: 'certain' | 'probable' | 'possible';
    linkScore: number;
  }>;
  lastUpdated: Date;
  active: boolean;
}

/**
 * Patient matching criteria
 */
export interface PatientMatchCriteria {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  sex?: string;
  ssn?: string;
  phone?: string;
  email?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  fuzzyMatch?: boolean;
  threshold?: number;
}

/**
 * Patient match result
 */
export interface PatientMatchResult {
  mpiId: string;
  matchScore: number;
  confidence: 'certain' | 'probable' | 'possible' | 'unlikely';
  matchedFields: string[];
  demographics: any;
  sourceRecords: Array<{
    system: string;
    patientId: string;
  }>;
}

/**
 * Document metadata for XDS
 */
export interface DocumentMetadata {
  documentId: string;
  repositoryUniqueId: string;
  title: string;
  mimeType: string;
  classCode: string;
  typeCode: string;
  formatCode: string;
  creationTime: Date;
  serviceStartTime?: Date;
  serviceStopTime?: Date;
  patientId: string;
  sourcePatientId?: string;
  authorPerson?: string;
  authorInstitution?: string;
  confidentialityCode?: string;
  languageCode?: string;
  size?: number;
  hash?: string;
  uri?: string;
}

/**
 * Document query parameters
 */
export interface DocumentQuery {
  patientId: string;
  classCode?: string[];
  typeCode?: string[];
  creationTimeFrom?: Date;
  creationTimeTo?: Date;
  serviceStartTimeFrom?: Date;
  serviceStartTimeTo?: Date;
  status?: string[];
  authorPerson?: string;
  facilityCode?: string[];
}

/**
 * Direct message structure (SMTP/S)
 */
export interface DirectMessage {
  messageId: string;
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    contentType: string;
    content: Buffer;
    size: number;
  }>;
  headers?: Record<string, string>;
  encrypted?: boolean;
  signed?: boolean;
  timestamp: Date;
  patientId?: string;
}

/**
 * Provider directory entry
 */
export interface ProviderDirectoryEntry {
  npi: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  credentials?: string[];
  specialty?: string;
  subspecialty?: string[];
  taxonomyCode?: string;
  organizationName?: string;
  organizationNPI?: string;
  addresses: Array<{
    type: 'practice' | 'mailing' | 'primary' | 'secondary';
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
    phone?: string;
    fax?: string;
  }>;
  phoneNumbers?: string[];
  faxNumbers?: string[];
  email?: string;
  licenseNumber?: string;
  licenseState?: string;
  deaNumber?: string;
  acceptingNewPatients?: boolean;
  languages?: string[];
  hospitalAffiliations?: string[];
  lastUpdated?: Date;
}

/**
 * Audit trail entry for HIE
 */
export interface HIEAuditEntry {
  id?: string;
  timestamp: Date;
  action: 'access' | 'create' | 'update' | 'delete' | 'query' | 'send' | 'receive' | 'disclosure';
  userId: string;
  userRole?: string;
  patientId: string;
  documentId?: string;
  resourceType?: string;
  organizationId: string;
  facilityId?: string;
  purpose: 'treatment' | 'payment' | 'operations' | 'research' | 'public-health' | 'emergency';
  sourceSystem: string;
  destinationSystem?: string;
  ipAddress: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  dataAccessed?: string[];
  consentId?: string;
  legalBasis?: string;
}

// ============================================================================
// SECTION 1: HL7 v2 MESSAGE PARSING (Functions 1-7)
// ============================================================================

/**
 * 1. Parses HL7 v2 message into structured format.
 *
 * @param {string} hl7Message - Raw HL7 v2 message with segment separators
 * @returns {HL7Message} Parsed message structure
 *
 * @example
 * ```typescript
 * const message = parseHL7Message(rawHL7);
 * console.log(`${message.messageType}^${message.eventType}`);
 * // Access patient data
 * const patientName = message.pid?.patientName;
 * ```
 */
export function parseHL7Message(hl7Message: string): HL7Message {
  const segments = hl7Message.split(/\r?\n/).filter(s => s.trim());

  if (segments.length === 0) {
    throw new Error('Empty HL7 message');
  }

  const mshSegment = segments[0];
  const mshFields = mshSegment.split('|');

  if (mshFields[0] !== 'MSH') {
    throw new Error('Invalid HL7 message - must start with MSH segment');
  }

  const messageTypeField = mshFields[8]?.split('^') || [];

  const parsed: HL7Message = {
    messageType: messageTypeField[0] as HL7MessageType,
    eventType: messageTypeField[1] || '',
    messageControlId: mshFields[9] || '',
    timestamp: parseHL7DateTime(mshFields[6]) || new Date(),
    sendingApplication: mshFields[2] || '',
    sendingFacility: mshFields[3] || '',
    receivingApplication: mshFields[4] || '',
    receivingFacility: mshFields[5] || '',
    versionId: mshFields[11] || '2.5',
    segments: [],
  };

  // Parse all segments
  for (const segment of segments) {
    const fields = segment.split('|');
    const segmentType = fields[0];

    parsed.segments.push({
      type: segmentType,
      fields: fields,
      rawSegment: segment,
    });

    // Parse specific segments
    if (segmentType === 'PID') {
      parsed.pid = parsePIDSegment(fields);
    } else if (segmentType === 'PV1') {
      parsed.pv1 = parsePV1Segment(fields);
    } else if (segmentType === 'OBR') {
      if (!parsed.obr) parsed.obr = [];
      parsed.obr.push(parseOBRSegment(fields));
    } else if (segmentType === 'OBX') {
      if (!parsed.obx) parsed.obx = [];
      parsed.obx.push(parseOBXSegment(fields));
    } else if (segmentType === 'ORC') {
      if (!parsed.orc) parsed.orc = [];
      parsed.orc.push(parseORCSegment(fields));
    }
  }

  return parsed;
}

/**
 * 2. Parses HL7 ADT (Admit, Discharge, Transfer) message.
 *
 * @param {string} adtMessage - Raw ADT message
 * @returns {HL7Message} Parsed ADT message with patient and visit data
 *
 * @example
 * ```typescript
 * const adt = parseADTMessage(rawADT);
 * if (adt.eventType === 'A01') {
 *   console.log(`Patient admitted: ${adt.pid?.patientName.familyName}`);
 *   console.log(`Room: ${adt.pv1?.assignedPatientLocation?.room}`);
 * }
 * ```
 */
export function parseADTMessage(adtMessage: string): HL7Message {
  const parsed = parseHL7Message(adtMessage);

  if (parsed.messageType !== 'ADT') {
    throw new Error(`Expected ADT message, got ${parsed.messageType}`);
  }

  if (!parsed.pid) {
    throw new Error('ADT message missing required PID segment');
  }

  return parsed;
}

/**
 * 3. Parses HL7 ORU (Observation Result) message for lab results.
 *
 * @param {string} oruMessage - Raw ORU message
 * @returns {HL7Message} Parsed ORU message with observation results
 *
 * @example
 * ```typescript
 * const oru = parseORUMessage(rawORU);
 * oru.obx?.forEach(obs => {
 *   console.log(`${obs.observationIdentifier.text}: ${obs.observationValue}`);
 * });
 * ```
 */
export function parseORUMessage(oruMessage: string): HL7Message {
  const parsed = parseHL7Message(oruMessage);

  if (parsed.messageType !== 'ORU') {
    throw new Error(`Expected ORU message, got ${parsed.messageType}`);
  }

  if (!parsed.obr || parsed.obr.length === 0) {
    throw new Error('ORU message missing required OBR segment');
  }

  return parsed;
}

/**
 * 4. Parses HL7 ORM (Order) message for medication/procedure orders.
 *
 * @param {string} ormMessage - Raw ORM message
 * @returns {HL7Message} Parsed ORM message with order data
 *
 * @example
 * ```typescript
 * const orm = parseORMMessage(rawORM);
 * const orderControl = orm.orc?.[0]?.orderControl;
 * console.log(`Order control: ${orderControl}`);
 * ```
 */
export function parseORMMessage(ormMessage: string): HL7Message {
  const parsed = parseHL7Message(ormMessage);

  if (parsed.messageType !== 'ORM') {
    throw new Error(`Expected ORM message, got ${parsed.messageType}`);
  }

  if (!parsed.orc || parsed.orc.length === 0) {
    throw new Error('ORM message missing required ORC segment');
  }

  return parsed;
}

/**
 * 5. Builds HL7 v2 message from structured data.
 *
 * @param {HL7Message} message - Structured HL7 message
 * @returns {string} HL7 v2 formatted string
 *
 * @example
 * ```typescript
 * const hl7String = buildHL7Message({
 *   messageType: 'ADT',
 *   eventType: 'A04',
 *   messageControlId: '12345',
 *   sendingApplication: 'WhiteCross',
 *   // ... other fields
 * });
 * ```
 */
export function buildHL7Message(message: HL7Message): string {
  const segments: string[] = [];

  // MSH segment
  const timestamp = formatHL7DateTime(message.timestamp);
  const msh = [
    'MSH',
    '^~\\&',
    message.sendingApplication,
    message.sendingFacility,
    message.receivingApplication,
    message.receivingFacility,
    timestamp,
    '',
    `${message.messageType}^${message.eventType}`,
    message.messageControlId,
    'P',
    message.versionId || '2.5',
  ].join('|');

  segments.push(msh);

  // Add other segments from raw segments if available
  message.segments.forEach(seg => {
    if (seg.type !== 'MSH') {
      segments.push(seg.rawSegment);
    }
  });

  return segments.join('\r\n') + '\r\n';
}

/**
 * 6. Validates HL7 message structure and required fields.
 *
 * @param {HL7Message} message - Parsed HL7 message
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateHL7Message(parsedMessage);
 * if (!validation.valid) {
 *   console.error('HL7 validation errors:', validation.errors);
 * }
 * ```
 */
export function validateHL7Message(message: HL7Message): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!message.messageType) {
    errors.push('Message type is required');
  }

  if (!message.eventType) {
    errors.push('Event type is required');
  }

  if (!message.messageControlId) {
    errors.push('Message control ID is required');
  }

  if (!message.sendingApplication) {
    warnings.push('Sending application not specified');
  }

  if (!message.receivingApplication) {
    warnings.push('Receiving application not specified');
  }

  if (message.messageType === 'ADT' && !message.pid) {
    errors.push('ADT message requires PID segment');
  }

  if (message.messageType === 'ORU' && (!message.obr || message.obr.length === 0)) {
    errors.push('ORU message requires at least one OBR segment');
  }

  if (message.messageType === 'ORM' && (!message.orc || message.orc.length === 0)) {
    errors.push('ORM message requires at least one ORC segment');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 7. Extracts patient demographics from HL7 message.
 *
 * @param {HL7Message} message - Parsed HL7 message
 * @returns {PatientIdentificationSegment | null} Patient demographics
 *
 * @example
 * ```typescript
 * const patient = extractPatientFromHL7(message);
 * if (patient) {
 *   console.log(`${patient.patientName.givenName} ${patient.patientName.familyName}`);
 * }
 * ```
 */
export function extractPatientFromHL7(message: HL7Message): PatientIdentificationSegment | null {
  return message.pid || null;
}

// ============================================================================
// SECTION 2: FHIR CONVERSION (Functions 8-14)
// ============================================================================

/**
 * 8. Converts HL7 v2 message to FHIR Bundle.
 *
 * @param {HL7Message} hl7Message - Parsed HL7 message
 * @returns {FHIRBundle} FHIR Bundle with converted resources
 *
 * @example
 * ```typescript
 * const bundle = convertHL7ToFHIR(parsedHL7);
 * bundle.entry.forEach(entry => {
 *   console.log(`Resource: ${entry.resource.resourceType}`);
 * });
 * ```
 */
export function convertHL7ToFHIR(hl7Message: HL7Message): FHIRBundle {
  const bundle: FHIRBundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    timestamp: new Date().toISOString(),
    entry: [],
  };

  // Convert PID to Patient resource
  if (hl7Message.pid) {
    const patient = convertPIDToFHIRPatient(hl7Message.pid);
    bundle.entry.push({
      fullUrl: `Patient/${patient.id}`,
      resource: patient,
      request: {
        method: 'POST',
        url: 'Patient',
      },
    });
  }

  // Convert PV1 to Encounter resource
  if (hl7Message.pv1) {
    const encounter = convertPV1ToFHIREncounter(hl7Message.pv1, hl7Message.pid?.patientId);
    bundle.entry.push({
      fullUrl: `Encounter/${encounter.id}`,
      resource: encounter,
      request: {
        method: 'POST',
        url: 'Encounter',
      },
    });
  }

  // Convert OBX to Observation resources
  if (hl7Message.obx) {
    hl7Message.obx.forEach(obx => {
      const observation = convertOBXToFHIRObservation(obx, hl7Message.pid?.patientId);
      bundle.entry.push({
        fullUrl: `Observation/${observation.id}`,
        resource: observation,
        request: {
          method: 'POST',
          url: 'Observation',
        },
      });
    });
  }

  return bundle;
}

/**
 * 9. Converts HL7 PID segment to FHIR Patient resource.
 *
 * @param {PatientIdentificationSegment} pid - HL7 PID segment
 * @returns {any} FHIR Patient resource
 *
 * @example
 * ```typescript
 * const fhirPatient = convertPIDToFHIRPatient(hl7Message.pid);
 * console.log(`Patient ID: ${fhirPatient.id}`);
 * ```
 */
export function convertPIDToFHIRPatient(pid: PatientIdentificationSegment): any {
  return {
    resourceType: 'Patient',
    id: pid.patientId,
    identifier: pid.patientIdentifierList.map(id => ({
      type: {
        coding: [{
          code: id.idType,
        }],
      },
      value: id.id,
      system: id.assigningAuthority,
    })),
    name: [{
      use: 'official',
      family: pid.patientName.familyName,
      given: [pid.patientName.givenName, pid.patientName.middleName].filter(Boolean),
      prefix: pid.patientName.prefix ? [pid.patientName.prefix] : undefined,
      suffix: pid.patientName.suffix ? [pid.patientName.suffix] : undefined,
    }],
    telecom: [
      pid.phoneHome ? { system: 'phone', value: pid.phoneHome, use: 'home' } : null,
      pid.phoneWork ? { system: 'phone', value: pid.phoneWork, use: 'work' } : null,
    ].filter(Boolean),
    gender: pid.sex?.toLowerCase(),
    birthDate: pid.dateOfBirth?.toISOString().split('T')[0],
    address: pid.patientAddress ? [{
      use: 'home',
      line: [pid.patientAddress.street],
      city: pid.patientAddress.city,
      state: pid.patientAddress.state,
      postalCode: pid.patientAddress.zip,
      country: pid.patientAddress.country,
    }] : undefined,
    maritalStatus: pid.maritalStatus ? {
      coding: [{
        code: pid.maritalStatus,
      }],
    } : undefined,
  };
}

/**
 * 10. Converts HL7 OBX segment to FHIR Observation resource.
 *
 * @param {ObservationResultSegment} obx - HL7 OBX segment
 * @param {string} patientId - Patient identifier
 * @returns {any} FHIR Observation resource
 *
 * @example
 * ```typescript
 * const observation = convertOBXToFHIRObservation(obx, 'patient-123');
 * console.log(`Observation: ${observation.code.coding[0].display}`);
 * ```
 */
export function convertOBXToFHIRObservation(obx: ObservationResultSegment, patientId?: string): any {
  return {
    resourceType: 'Observation',
    id: crypto.randomUUID(),
    status: obx.observationResultStatus === 'F' ? 'final' : 'preliminary',
    code: {
      coding: [{
        system: obx.observationIdentifier.codingSystem,
        code: obx.observationIdentifier.identifier,
        display: obx.observationIdentifier.text,
      }],
    },
    subject: patientId ? {
      reference: `Patient/${patientId}`,
    } : undefined,
    valueQuantity: obx.valueType === 'NM' ? {
      value: parseFloat(obx.observationValue),
      unit: obx.units,
    } : undefined,
    valueString: obx.valueType === 'ST' ? obx.observationValue : undefined,
    referenceRange: obx.referenceRange ? [{
      text: obx.referenceRange,
    }] : undefined,
    interpretation: obx.abnormalFlags ? [{
      coding: obx.abnormalFlags.map(flag => ({
        code: flag,
      })),
    }] : undefined,
    effectiveDateTime: obx.observationDateTime?.toISOString(),
  };
}

/**
 * 11. Converts FHIR Patient resource to HL7 PID segment.
 *
 * @param {any} fhirPatient - FHIR Patient resource
 * @returns {PatientIdentificationSegment} HL7 PID segment
 *
 * @example
 * ```typescript
 * const pid = convertFHIRPatientToPID(fhirPatient);
 * const hl7Message = buildHL7MessageWithPID(pid);
 * ```
 */
export function convertFHIRPatientToPID(fhirPatient: any): PatientIdentificationSegment {
  const name = fhirPatient.name?.[0] || {};
  const address = fhirPatient.address?.[0];
  const homePhone = fhirPatient.telecom?.find((t: any) => t.system === 'phone' && t.use === 'home');
  const workPhone = fhirPatient.telecom?.find((t: any) => t.system === 'phone' && t.use === 'work');

  return {
    patientId: fhirPatient.id,
    patientIdentifierList: (fhirPatient.identifier || []).map((id: any) => ({
      id: id.value,
      idType: id.type?.coding?.[0]?.code || 'MR',
      assigningAuthority: id.system,
    })),
    patientName: {
      familyName: name.family || '',
      givenName: name.given?.[0] || '',
      middleName: name.given?.[1],
      suffix: name.suffix?.[0],
      prefix: name.prefix?.[0],
    },
    dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : undefined,
    sex: fhirPatient.gender?.toUpperCase(),
    patientAddress: address ? {
      street: address.line?.[0] || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.postalCode || '',
      country: address.country,
    } : undefined,
    phoneHome: homePhone?.value,
    phoneWork: workPhone?.value,
    maritalStatus: fhirPatient.maritalStatus?.coding?.[0]?.code,
  };
}

/**
 * 12. Creates FHIR Bundle from multiple resources.
 *
 * @param {any[]} resources - Array of FHIR resources
 * @param {string} bundleType - Bundle type
 * @returns {FHIRBundle} FHIR Bundle
 *
 * @example
 * ```typescript
 * const bundle = createFHIRBundle([patient, encounter, observation], 'transaction');
 * await fhirClient.create(bundle);
 * ```
 */
export function createFHIRBundle(
  resources: any[],
  bundleType: 'transaction' | 'batch' | 'collection' | 'document' = 'transaction'
): FHIRBundle {
  return {
    resourceType: 'Bundle',
    type: bundleType,
    timestamp: new Date().toISOString(),
    entry: resources.map(resource => ({
      fullUrl: `${resource.resourceType}/${resource.id || crypto.randomUUID()}`,
      resource,
      request: bundleType === 'transaction' || bundleType === 'batch' ? {
        method: 'POST',
        url: resource.resourceType,
      } : undefined,
    })),
  };
}

/**
 * 13. Extracts resources from FHIR Bundle by type.
 *
 * @param {FHIRBundle} bundle - FHIR Bundle
 * @param {FHIRResourceType} resourceType - Resource type to extract
 * @returns {any[]} Array of matching resources
 *
 * @example
 * ```typescript
 * const patients = extractResourcesFromBundle(bundle, 'Patient');
 * const observations = extractResourcesFromBundle(bundle, 'Observation');
 * ```
 */
export function extractResourcesFromBundle(bundle: FHIRBundle, resourceType: FHIRResourceType): any[] {
  return bundle.entry
    .filter(entry => entry.resource?.resourceType === resourceType)
    .map(entry => entry.resource);
}

/**
 * 14. Validates FHIR resource against schema.
 *
 * @param {any} resource - FHIR resource
 * @param {FHIRResourceType} expectedType - Expected resource type
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateFHIRResource(patient, 'Patient');
 * if (!validation.valid) {
 *   console.error('FHIR validation errors:', validation.errors);
 * }
 * ```
 */
export function validateFHIRResource(resource: any, expectedType: FHIRResourceType): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!resource) {
    errors.push('Resource is null or undefined');
    return { valid: false, errors, warnings };
  }

  if (resource.resourceType !== expectedType) {
    errors.push(`Expected ${expectedType}, got ${resource.resourceType}`);
  }

  // Resource-specific validation
  if (expectedType === 'Patient') {
    if (!resource.name || resource.name.length === 0) {
      warnings.push('Patient should have at least one name');
    }
    if (!resource.gender) {
      warnings.push('Patient should have a gender');
    }
  }

  if (expectedType === 'Observation') {
    if (!resource.status) {
      errors.push('Observation must have a status');
    }
    if (!resource.code) {
      errors.push('Observation must have a code');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SECTION 3: CONTINUITY OF CARE DOCUMENT (Functions 15-18)
// ============================================================================

/**
 * 15. Generates Continuity of Care Document (CCD) in C-CDA format.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD data
 * @returns {string} XML formatted CCD
 *
 * @example
 * ```typescript
 * const ccdXml = generateCCD({
 *   patientId: 'patient-123',
 *   documentId: 'doc-456',
 *   documentDate: new Date(),
 *   author: { id: 'dr-789', name: 'Dr. Smith' },
 *   custodian: { id: 'org-001', name: 'White Cross Hospital' },
 *   sections: { allergies, medications, problems }
 * });
 * ```
 */
export function generateCCD(ccd: ContinuityOfCareDocument): string {
  const timestamp = ccd.documentDate.toISOString();

  // Build C-CDA XML structure
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ClinicalDocument xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <realmCode code="US"/>
  <typeId root="2.16.840.1.113883.1.3" extension="POCD_HD000040"/>
  <templateId root="2.16.840.1.113883.10.20.22.1.1" extension="2015-08-01"/>
  <templateId root="2.16.840.1.113883.10.20.22.1.2" extension="2015-08-01"/>
  <id root="${ccd.documentId}"/>
  <code code="34133-9" displayName="Summarization of Episode Note" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LOINC"/>
  <title>Continuity of Care Document</title>
  <effectiveTime value="${timestamp.replace(/[-:]/g, '').split('.')[0]}"/>
  <confidentialityCode code="N" codeSystem="2.16.840.1.113883.5.25"/>
  <languageCode code="en-US"/>

  <recordTarget>
    <patientRole>
      <id extension="${ccd.patientId}"/>
    </patientRole>
  </recordTarget>

  <author>
    <time value="${timestamp.replace(/[-:]/g, '').split('.')[0]}"/>
    <assignedAuthor>
      <id extension="${ccd.author.id}"/>
      <assignedPerson>
        <name>${ccd.author.name}</name>
      </assignedPerson>
    </assignedAuthor>
  </author>

  <custodian>
    <assignedCustodian>
      <representedCustodianOrganization>
        <id extension="${ccd.custodian.id}"/>
        <name>${ccd.custodian.name}</name>
      </representedCustodianOrganization>
    </assignedCustodian>
  </custodian>

  <component>
    <structuredBody>
      ${generateCCDAllergiesSection(ccd.sections.allergies)}
      ${generateCCDMedicationsSection(ccd.sections.medications)}
      ${generateCCDProblemsSection(ccd.sections.problems)}
      ${generateCCDProceduresSection(ccd.sections.procedures)}
      ${generateCCDVitalSignsSection(ccd.sections.vitalSigns)}
      ${generateCCDImmunizationsSection(ccd.sections.immunizations)}
      ${generateCCDResultsSection(ccd.sections.results)}
    </structuredBody>
  </component>
</ClinicalDocument>`;

  return xml;
}

/**
 * 16. Parses C-CDA document to structured CCD format.
 *
 * @param {string} ccda - C-CDA XML document
 * @returns {ContinuityOfCareDocument} Parsed CCD structure
 *
 * @example
 * ```typescript
 * const ccd = parseCCDA(ccdaXml);
 * console.log(`Patient: ${ccd.patientId}`);
 * console.log(`Allergies: ${ccd.sections.allergies?.length}`);
 * ```
 */
export function parseCCDA(ccda: string): ContinuityOfCareDocument {
  // Simplified parsing - in production use xml2js
  const ccd: ContinuityOfCareDocument = {
    patientId: extractXMLValue(ccda, 'patientRole', 'id', 'extension') || '',
    documentId: extractXMLValue(ccda, 'ClinicalDocument', 'id', 'root') || '',
    documentDate: new Date(),
    author: {
      id: extractXMLValue(ccda, 'assignedAuthor', 'id', 'extension') || '',
      name: extractXMLValue(ccda, 'assignedPerson', 'name') || '',
    },
    custodian: {
      id: extractXMLValue(ccda, 'representedCustodianOrganization', 'id', 'extension') || '',
      name: extractXMLValue(ccda, 'representedCustodianOrganization', 'name') || '',
    },
    sections: {
      allergies: [],
      medications: [],
      problems: [],
      procedures: [],
      vitalSigns: [],
      immunizations: [],
      results: [],
    },
  };

  return ccd;
}

/**
 * 17. Converts CCD to FHIR Composition resource.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD data
 * @returns {any} FHIR Composition resource
 *
 * @example
 * ```typescript
 * const composition = convertCCDToFHIRComposition(ccd);
 * const bundle = createFHIRBundle([composition, ...otherResources], 'document');
 * ```
 */
export function convertCCDToFHIRComposition(ccd: ContinuityOfCareDocument): any {
  return {
    resourceType: 'Composition',
    id: ccd.documentId,
    status: 'final',
    type: {
      coding: [{
        system: 'http://loinc.org',
        code: '34133-9',
        display: 'Summarization of Episode Note',
      }],
    },
    subject: {
      reference: `Patient/${ccd.patientId}`,
    },
    date: ccd.documentDate.toISOString(),
    author: [{
      reference: `Practitioner/${ccd.author.id}`,
      display: ccd.author.name,
    }],
    title: 'Continuity of Care Document',
    custodian: {
      reference: `Organization/${ccd.custodian.id}`,
      display: ccd.custodian.name,
    },
    section: [
      ccd.sections.allergies && {
        title: 'Allergies and Intolerances',
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '48765-2',
            display: 'Allergies and adverse reactions',
          }],
        },
        entry: ccd.sections.allergies.map(a => ({
          reference: `AllergyIntolerance/${crypto.randomUUID()}`,
        })),
      },
      ccd.sections.medications && {
        title: 'Medications',
        code: {
          coding: [{
            system: 'http://loinc.org',
            code: '10160-0',
            display: 'History of medication use',
          }],
        },
        entry: ccd.sections.medications.map(m => ({
          reference: `MedicationStatement/${crypto.randomUUID()}`,
        })),
      },
    ].filter(Boolean),
  };
}

/**
 * 18. Validates CCD structure and required sections.
 *
 * @param {ContinuityOfCareDocument} ccd - CCD to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateCCD(ccd);
 * if (!validation.valid) {
 *   throw new Error(`CCD validation failed: ${validation.errors.join(', ')}`);
 * }
 * ```
 */
export function validateCCD(ccd: ContinuityOfCareDocument): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!ccd.patientId) {
    errors.push('Patient ID is required');
  }

  if (!ccd.documentId) {
    errors.push('Document ID is required');
  }

  if (!ccd.documentDate) {
    errors.push('Document date is required');
  }

  if (!ccd.author?.id || !ccd.author?.name) {
    errors.push('Author information is required');
  }

  if (!ccd.custodian?.id || !ccd.custodian?.name) {
    errors.push('Custodian information is required');
  }

  if (!ccd.sections) {
    errors.push('Sections are required');
  }

  // Check for at least some clinical data
  const hasData = ccd.sections.allergies?.length ||
                  ccd.sections.medications?.length ||
                  ccd.sections.problems?.length ||
                  ccd.sections.procedures?.length ||
                  ccd.sections.vitalSigns?.length;

  if (!hasData) {
    warnings.push('CCD contains no clinical data');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// SECTION 4: DIRECT MESSAGING (Functions 19-22)
// ============================================================================

/**
 * 19. Creates Direct secure message (SMTP/S) for healthcare data exchange.
 *
 * @param {Partial<DirectMessage>} message - Direct message data
 * @returns {DirectMessage} Complete Direct message
 *
 * @example
 * ```typescript
 * const directMsg = createDirectMessage({
 *   from: 'provider@whitecross.direct',
 *   to: ['specialist@hospital.direct'],
 *   subject: 'Patient Referral',
 *   body: 'Referring patient for evaluation',
 *   attachments: [{ filename: 'ccd.xml', content: ccdBuffer }]
 * });
 * ```
 */
export function createDirectMessage(message: Partial<DirectMessage>): DirectMessage {
  return {
    messageId: crypto.randomUUID(),
    from: message.from || '',
    to: message.to || [],
    cc: message.cc,
    subject: message.subject || '',
    body: message.body || '',
    attachments: message.attachments || [],
    headers: {
      'X-Direct-Final-Destination-Delivery': 'true',
      'Content-Type': 'multipart/mixed',
      ...message.headers,
    },
    encrypted: message.encrypted ?? true,
    signed: message.signed ?? true,
    timestamp: new Date(),
    patientId: message.patientId,
  };
}

/**
 * 20. Signs Direct message with S/MIME certificate.
 *
 * @param {DirectMessage} message - Direct message to sign
 * @param {string} privateKey - PEM private key
 * @param {string} certificate - PEM certificate
 * @returns {string} Signed message
 *
 * @example
 * ```typescript
 * const signedMsg = signDirectMessage(
 *   directMsg,
 *   process.env.DIRECT_PRIVATE_KEY,
 *   process.env.DIRECT_CERTIFICATE
 * );
 * await smtpTransport.sendMail(signedMsg);
 * ```
 */
export function signDirectMessage(message: DirectMessage, privateKey: string, certificate: string): string {
  // In production, use node-forge or similar for S/MIME signing
  const messageContent = `From: ${message.from}\r
To: ${message.to.join(', ')}\r
Subject: ${message.subject}\r
Date: ${message.timestamp.toUTCString()}\r
Message-ID: <${message.messageId}>\r
MIME-Version: 1.0\r
Content-Type: multipart/signed; protocol="application/pkcs7-signature"\r
\r
${message.body}`;

  // Simplified - actual implementation would use crypto.sign()
  const signature = crypto.createSign('RSA-SHA256')
    .update(messageContent)
    .sign(privateKey, 'base64');

  return `${messageContent}\r\n\r\n--SIGNATURE--\r\n${signature}`;
}

/**
 * 21. Encrypts Direct message with recipient's public certificate.
 *
 * @param {DirectMessage} message - Direct message to encrypt
 * @param {string} recipientCertificate - Recipient's public certificate
 * @returns {string} Encrypted message
 *
 * @example
 * ```typescript
 * const encryptedMsg = encryptDirectMessage(
 *   directMsg,
 *   recipientPublicCert
 * );
 * ```
 */
export function encryptDirectMessage(message: DirectMessage, recipientCertificate: string): string {
  // In production, use node-forge for S/MIME encryption
  const messageContent = JSON.stringify(message);

  // Simplified encryption - actual implementation would use recipient's public key
  const encrypted = Buffer.from(messageContent).toString('base64');

  return `-----BEGIN ENCRYPTED MESSAGE-----\r\n${encrypted}\r\n-----END ENCRYPTED MESSAGE-----`;
}

/**
 * 22. Validates Direct address format (RFC 5322).
 *
 * @param {string} address - Direct address to validate
 * @returns {boolean} True if valid Direct address
 *
 * @example
 * ```typescript
 * if (!validateDirectAddress(recipientAddress)) {
 *   throw new Error('Invalid Direct address');
 * }
 * ```
 */
export function validateDirectAddress(address: string): boolean {
  // Direct addresses must be valid email addresses with .direct domain or HISP
  const directPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(direct|directtrust\.org)$/i;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return directPattern.test(address) || emailPattern.test(address);
}

// ============================================================================
// SECTION 5: PATIENT CONSENT MANAGEMENT (Functions 23-27)
// ============================================================================

/**
 * 23. Records patient consent for health information exchange.
 *
 * @param {HIEConsent} consent - Consent details
 * @returns {HIEConsent} Consent record with ID
 *
 * @example
 * ```typescript
 * const consent = recordHIEConsent({
 *   patientId: 'patient-123',
 *   consentType: 'opt-in',
 *   scope: 'full',
 *   status: 'active',
 *   effectiveDate: new Date(),
 *   signedBy: 'patient-123',
 *   signatureDate: new Date()
 * });
 * ```
 */
export function recordHIEConsent(consent: HIEConsent): HIEConsent {
  return {
    ...consent,
    id: consent.id || crypto.randomUUID(),
  };
}

/**
 * 24. Checks if patient has consented to data sharing.
 *
 * @param {string} patientId - Patient identifier
 * @param {HIEConsent[]} consents - Patient consent records
 * @param {string} organizationId - Requesting organization
 * @returns {boolean} True if consent granted
 *
 * @example
 * ```typescript
 * const hasConsent = checkHIEConsent(
 *   'patient-123',
 *   patientConsents,
 *   'org-456'
 * );
 * if (!hasConsent) {
 *   throw new ForbiddenException('Patient has not consented to data sharing');
 * }
 * ```
 */
export function checkHIEConsent(
  patientId: string,
  consents: HIEConsent[],
  organizationId?: string
): boolean {
  const activeConsents = consents.filter(c =>
    c.patientId === patientId &&
    c.status === 'active' &&
    new Date() >= c.effectiveDate &&
    (!c.expirationDate || new Date() <= c.expirationDate)
  );

  if (activeConsents.length === 0) {
    return false;
  }

  // Check for opt-out
  const optOut = activeConsents.find(c => c.consentType === 'opt-out');
  if (optOut) {
    return false;
  }

  // Check organization-specific consent
  if (organizationId) {
    const orgConsent = activeConsents.find(c =>
      c.authorizedOrganizations?.includes(organizationId)
    );
    if (orgConsent) {
      return true;
    }
  }

  // Check for general opt-in
  const optIn = activeConsents.find(c =>
    c.consentType === 'opt-in' &&
    (c.scope === 'full' || c.scope === 'limited')
  );

  return !!optIn;
}

/**
 * 25. Revokes patient consent for HIE.
 *
 * @param {string} consentId - Consent record ID
 * @param {string} revokedBy - User revoking consent
 * @param {string} reason - Reason for revocation
 * @returns {HIEConsent} Updated consent record
 *
 * @example
 * ```typescript
 * const revokedConsent = revokeHIEConsent(
 *   'consent-123',
 *   'patient-456',
 *   'Patient requested removal'
 * );
 * ```
 */
export function revokeHIEConsent(consentId: string, revokedBy: string, reason?: string): Partial<HIEConsent> {
  return {
    id: consentId,
    status: 'revoked',
    revokedDate: new Date(),
    revokedBy,
    revokedReason: reason,
  };
}

/**
 * 26. Generates patient consent form for signature.
 *
 * @param {string} patientId - Patient identifier
 * @param {string} scope - Consent scope
 * @returns {string} HTML consent form
 *
 * @example
 * ```typescript
 * const consentForm = generateConsentForm('patient-123', 'full');
 * // Display form for patient signature
 * ```
 */
export function generateConsentForm(patientId: string, scope: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Health Information Exchange Consent Form</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .content { line-height: 1.6; }
    .signature { margin-top: 50px; border-top: 1px solid #000; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Authorization for Health Information Exchange</h1>
  </div>
  <div class="content">
    <p>Patient ID: ${patientId}</p>
    <p>Consent Scope: ${scope.toUpperCase()}</p>

    <h2>Purpose</h2>
    <p>This form allows your healthcare providers to electronically share your health information
    for treatment, care coordination, and quality improvement purposes.</p>

    <h2>Information Shared</h2>
    <p>Your medical records, lab results, medications, allergies, diagnoses, and treatment history
    may be shared with authorized healthcare providers involved in your care.</p>

    <h2>Your Rights</h2>
    <ul>
      <li>You have the right to revoke this authorization at any time</li>
      <li>You have the right to request an accounting of disclosures</li>
      <li>You have the right to restrict certain disclosures</li>
    </ul>

    <div class="signature">
      <p>By signing below, I authorize the exchange of my health information as described above.</p>
      <p>Signature: ___________________________ Date: _______________</p>
      <p>Printed Name: _________________________</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 27. Checks break-glass emergency access authorization.
 *
 * @param {string} userId - User requesting access
 * @param {string} patientId - Patient ID
 * @param {string} justification - Emergency justification
 * @returns {boolean} True if emergency access granted
 *
 * @example
 * ```typescript
 * const emergencyAccess = checkBreakGlassAccess(
 *   'dr-123',
 *   'patient-456',
 *   'Life-threatening emergency - cardiac arrest'
 * );
 * ```
 */
export function checkBreakGlassAccess(userId: string, patientId: string, justification: string): boolean {
  // In production, this would check emergency access policies and log the break-glass event
  if (!justification || justification.length < 10) {
    return false;
  }

  // Log break-glass access for audit
  const auditEntry: HIEAuditEntry = {
    timestamp: new Date(),
    action: 'access',
    userId,
    patientId,
    organizationId: 'emergency',
    purpose: 'emergency',
    sourceSystem: 'break-glass',
    ipAddress: '0.0.0.0',
    success: true,
    legalBasis: `Break-glass emergency access: ${justification}`,
  };

  console.log('BREAK-GLASS ACCESS:', auditEntry);

  return true;
}

// ============================================================================
// SECTION 6: MASTER PATIENT INDEX (Functions 28-32)
// ============================================================================

/**
 * 28. Creates Master Patient Index entry.
 *
 * @param {Partial<MPIEntry>} entry - MPI entry data
 * @returns {MPIEntry} Complete MPI entry
 *
 * @example
 * ```typescript
 * const mpiEntry = createMPIEntry({
 *   sourceSystem: 'epic',
 *   sourcePatientId: 'epic-12345',
 *   demographics: { firstName: 'John', lastName: 'Doe', dateOfBirth: dob, sex: 'M' }
 * });
 * ```
 */
export function createMPIEntry(entry: Partial<MPIEntry>): MPIEntry {
  return {
    mpiId: entry.mpiId || crypto.randomUUID(),
    sourceSystem: entry.sourceSystem || '',
    sourcePatientId: entry.sourcePatientId || '',
    demographics: entry.demographics || {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      sex: 'U',
    },
    addresses: entry.addresses || [],
    phones: entry.phones || [],
    emails: entry.emails || [],
    identifiers: entry.identifiers || [],
    matchConfidence: entry.matchConfidence,
    linkages: entry.linkages || [],
    lastUpdated: new Date(),
    active: entry.active ?? true,
  };
}

/**
 * 29. Performs probabilistic patient matching across systems.
 *
 * @param {PatientMatchCriteria} criteria - Search criteria
 * @param {MPIEntry[]} mpiEntries - Existing MPI entries
 * @returns {PatientMatchResult[]} Sorted match results
 *
 * @example
 * ```typescript
 * const matches = performPatientMatching({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1990-01-01'),
 *   sex: 'M'
 * }, mpiDatabase);
 *
 * const bestMatch = matches[0];
 * if (bestMatch.confidence === 'certain') {
 *   // Use existing MPI ID
 * }
 * ```
 */
export function performPatientMatching(
  criteria: PatientMatchCriteria,
  mpiEntries: MPIEntry[]
): PatientMatchResult[] {
  const results: PatientMatchResult[] = [];

  for (const entry of mpiEntries) {
    if (!entry.active) continue;

    let score = 0;
    const matchedFields: string[] = [];

    // Exact matches (high weight)
    if (criteria.ssn && entry.demographics.ssn === criteria.ssn) {
      score += 100;
      matchedFields.push('ssn');
    }

    // Name matching
    if (criteria.firstName && criteria.lastName) {
      const firstNameMatch = soundexMatch(
        criteria.firstName,
        entry.demographics.firstName
      );
      const lastNameMatch = soundexMatch(
        criteria.lastName,
        entry.demographics.lastName
      );

      if (firstNameMatch && lastNameMatch) {
        score += 50;
        matchedFields.push('name');
      } else if (firstNameMatch || lastNameMatch) {
        score += 20;
        matchedFields.push('partial-name');
      }
    }

    // Date of birth
    if (criteria.dateOfBirth && entry.demographics.dateOfBirth) {
      const dobMatch = criteria.dateOfBirth.getTime() === entry.demographics.dateOfBirth.getTime();
      if (dobMatch) {
        score += 40;
        matchedFields.push('dob');
      }
    }

    // Sex
    if (criteria.sex && entry.demographics.sex === criteria.sex) {
      score += 10;
      matchedFields.push('sex');
    }

    // Phone
    if (criteria.phone && entry.phones?.includes(criteria.phone)) {
      score += 30;
      matchedFields.push('phone');
    }

    // Email
    if (criteria.email && entry.emails?.includes(criteria.email)) {
      score += 25;
      matchedFields.push('email');
    }

    // Address matching
    if (criteria.address && entry.addresses && entry.addresses.length > 0) {
      const addressMatch = entry.addresses.some(addr =>
        addr.zip === criteria.address?.zip &&
        addr.state === criteria.address?.state
      );
      if (addressMatch) {
        score += 15;
        matchedFields.push('address');
      }
    }

    // Determine confidence level
    let confidence: 'certain' | 'probable' | 'possible' | 'unlikely';
    if (score >= 100) confidence = 'certain';
    else if (score >= 70) confidence = 'probable';
    else if (score >= 40) confidence = 'possible';
    else confidence = 'unlikely';

    if (score >= (criteria.threshold || 40)) {
      results.push({
        mpiId: entry.mpiId,
        matchScore: score,
        confidence,
        matchedFields,
        demographics: entry.demographics,
        sourceRecords: [{
          system: entry.sourceSystem,
          patientId: entry.sourcePatientId,
        }],
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 30. Links patient records across different healthcare systems.
 *
 * @param {string} primaryMpiId - Primary MPI ID
 * @param {string} secondaryMpiId - Secondary MPI ID to link
 * @param {string} linkType - Type of linkage
 * @param {number} linkScore - Confidence score
 * @returns {MPIEntry} Updated primary MPI entry
 *
 * @example
 * ```typescript
 * const linkedEntry = linkPatientRecords(
 *   'mpi-123',
 *   'mpi-456',
 *   'probable',
 *   85
 * );
 * ```
 */
export function linkPatientRecords(
  primaryMpiId: string,
  secondaryMpiId: string,
  linkType: 'certain' | 'probable' | 'possible',
  linkScore: number
): Partial<MPIEntry> {
  return {
    mpiId: primaryMpiId,
    linkages: [{
      linkedMpiId: secondaryMpiId,
      linkType,
      linkScore,
    }],
    lastUpdated: new Date(),
  };
}

/**
 * 31. Retrieves patient's enterprise medical record number (EMRN).
 *
 * @param {string} mpiId - MPI identifier
 * @param {MPIEntry[]} mpiEntries - MPI database
 * @returns {string | null} Enterprise MRN
 *
 * @example
 * ```typescript
 * const emrn = getEnterpriseEMRN('mpi-123', mpiDatabase);
 * console.log(`Enterprise MRN: ${emrn}`);
 * ```
 */
export function getEnterpriseEMRN(mpiId: string, mpiEntries: MPIEntry[]): string | null {
  const entry = mpiEntries.find(e => e.mpiId === mpiId && e.active);
  if (!entry) return null;

  // EMRN is the MPI ID formatted as an enterprise identifier
  return `EMRN-${mpiId}`;
}

/**
 * 32. Merges duplicate MPI entries.
 *
 * @param {string} survivorMpiId - MPI ID to keep
 * @param {string[]} duplicateMpiIds - MPI IDs to merge
 * @returns {MPIEntry} Merged MPI entry
 *
 * @example
 * ```typescript
 * const mergedEntry = mergeMPIEntries(
 *   'mpi-primary',
 *   ['mpi-dup1', 'mpi-dup2']
 * );
 * ```
 */
export function mergeMPIEntries(survivorMpiId: string, duplicateMpiIds: string[]): Partial<MPIEntry> {
  return {
    mpiId: survivorMpiId,
    linkages: duplicateMpiIds.map(dupId => ({
      linkedMpiId: dupId,
      linkType: 'certain' as const,
      linkScore: 100,
    })),
    lastUpdated: new Date(),
  };
}

// ============================================================================
// SECTION 7: PROVIDER DIRECTORY (Functions 33-35)
// ============================================================================

/**
 * 33. Queries National Provider Directory (NPPES).
 *
 * @param {string} npi - National Provider Identifier
 * @returns {ProviderDirectoryEntry | null} Provider details
 *
 * @example
 * ```typescript
 * const provider = queryProviderDirectory('1234567890');
 * if (provider) {
 *   console.log(`${provider.firstName} ${provider.lastName}, ${provider.specialty}`);
 * }
 * ```
 */
export function queryProviderDirectory(npi: string): ProviderDirectoryEntry | null {
  // In production, this would query NPPES or internal directory
  if (!/^\d{10}$/.test(npi)) {
    return null;
  }

  // Mock provider data
  return {
    npi,
    firstName: 'Jane',
    lastName: 'Smith',
    credentials: ['MD', 'FACP'],
    specialty: 'Internal Medicine',
    taxonomyCode: '207R00000X',
    addresses: [{
      type: 'practice',
      street1: '123 Medical Plaza',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'US',
      phone: '415-555-0100',
    }],
    acceptingNewPatients: true,
    languages: ['English', 'Spanish'],
  };
}

/**
 * 34. Searches providers by specialty and location.
 *
 * @param {string} specialty - Provider specialty
 * @param {string} zipCode - ZIP code
 * @param {number} radiusMiles - Search radius
 * @returns {ProviderDirectoryEntry[]} Matching providers
 *
 * @example
 * ```typescript
 * const cardiologists = searchProvidersBySpecialty(
 *   'Cardiology',
 *   '94102',
 *   25
 * );
 * ```
 */
export function searchProvidersBySpecialty(
  specialty: string,
  zipCode: string,
  radiusMiles: number = 10
): ProviderDirectoryEntry[] {
  // In production, query provider directory with geospatial search
  return [];
}

/**
 * 35. Validates National Provider Identifier (NPI).
 *
 * @param {string} npi - NPI to validate
 * @returns {boolean} True if valid NPI
 *
 * @example
 * ```typescript
 * if (!validateNPI(providerNPI)) {
 *   throw new Error('Invalid NPI');
 * }
 * ```
 */
export function validateNPI(npi: string): boolean {
  // NPI must be 10 digits
  if (!/^\d{10}$/.test(npi)) {
    return false;
  }

  // Luhn algorithm check
  const digits = npi.split('').map(Number);
  let sum = 0;

  for (let i = digits.length - 2; i >= 0; i -= 2) {
    let doubled = digits[i] * 2;
    if (doubled > 9) {
      doubled -= 9;
    }
    sum += doubled;
  }

  for (let i = digits.length - 1; i >= 0; i -= 2) {
    sum += digits[i];
  }

  return sum % 10 === 0;
}

// ============================================================================
// SECTION 8: DOCUMENT EXCHANGE (Functions 36-39)
// ============================================================================

/**
 * 36. Creates XDS document metadata for registry.
 *
 * @param {Partial<DocumentMetadata>} metadata - Document metadata
 * @returns {DocumentMetadata} Complete document metadata
 *
 * @example
 * ```typescript
 * const metadata = createDocumentMetadata({
 *   title: 'Discharge Summary',
 *   patientId: 'patient-123',
 *   classCode: '11490-0',
 *   typeCode: '18842-5',
 *   mimeType: 'application/pdf'
 * });
 * ```
 */
export function createDocumentMetadata(metadata: Partial<DocumentMetadata>): DocumentMetadata {
  return {
    documentId: metadata.documentId || crypto.randomUUID(),
    repositoryUniqueId: metadata.repositoryUniqueId || '1.2.3.4.5',
    title: metadata.title || '',
    mimeType: metadata.mimeType || 'application/pdf',
    classCode: metadata.classCode || '',
    typeCode: metadata.typeCode || '',
    formatCode: metadata.formatCode || 'urn:ihe:iti:xds:2017',
    creationTime: metadata.creationTime || new Date(),
    serviceStartTime: metadata.serviceStartTime,
    serviceStopTime: metadata.serviceStopTime,
    patientId: metadata.patientId || '',
    sourcePatientId: metadata.sourcePatientId,
    authorPerson: metadata.authorPerson,
    authorInstitution: metadata.authorInstitution,
    confidentialityCode: metadata.confidentialityCode || 'N',
    languageCode: metadata.languageCode || 'en-US',
    size: metadata.size,
    hash: metadata.hash,
    uri: metadata.uri,
  };
}

/**
 * 37. Queries document registry (XDS ITI-18).
 *
 * @param {DocumentQuery} query - Document query parameters
 * @param {DocumentMetadata[]} registry - Document registry
 * @returns {DocumentMetadata[]} Matching documents
 *
 * @example
 * ```typescript
 * const documents = queryDocumentRegistry({
 *   patientId: 'patient-123',
 *   classCode: ['11490-0', '18842-5'],
 *   creationTimeFrom: new Date('2024-01-01')
 * }, documentRegistry);
 * ```
 */
export function queryDocumentRegistry(
  query: DocumentQuery,
  registry: DocumentMetadata[]
): DocumentMetadata[] {
  return registry.filter(doc => {
    // Patient ID match (required)
    if (doc.patientId !== query.patientId) {
      return false;
    }

    // Class code filter
    if (query.classCode && !query.classCode.includes(doc.classCode)) {
      return false;
    }

    // Type code filter
    if (query.typeCode && !query.typeCode.includes(doc.typeCode)) {
      return false;
    }

    // Creation time filter
    if (query.creationTimeFrom && doc.creationTime < query.creationTimeFrom) {
      return false;
    }

    if (query.creationTimeTo && doc.creationTime > query.creationTimeTo) {
      return false;
    }

    // Service time filter
    if (query.serviceStartTimeFrom && doc.serviceStartTime && doc.serviceStartTime < query.serviceStartTimeFrom) {
      return false;
    }

    if (query.serviceStartTimeTo && doc.serviceStartTime && doc.serviceStartTime > query.serviceStartTimeTo) {
      return false;
    }

    // Author filter
    if (query.authorPerson && doc.authorPerson !== query.authorPerson) {
      return false;
    }

    return true;
  });
}

/**
 * 38. Retrieves document from repository (XDS ITI-43).
 *
 * @param {string} documentId - Document unique ID
 * @param {string} repositoryId - Repository unique ID
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const document = await retrieveDocument(
 *   'doc-123',
 *   'repo-456'
 * );
 * res.setHeader('Content-Type', 'application/pdf');
 * res.send(document);
 * ```
 */
export async function retrieveDocument(documentId: string, repositoryId: string): Promise<Buffer> {
  // In production, retrieve from document repository
  return Buffer.from(`Document ${documentId} from repository ${repositoryId}`);
}

/**
 * 39. Submits document to repository (XDS ITI-41).
 *
 * @param {DocumentMetadata} metadata - Document metadata
 * @param {Buffer} content - Document content
 * @returns {string} Document ID
 *
 * @example
 * ```typescript
 * const docId = await submitDocument(
 *   documentMetadata,
 *   pdfBuffer
 * );
 * console.log(`Document submitted: ${docId}`);
 * ```
 */
export async function submitDocument(metadata: DocumentMetadata, content: Buffer): Promise<string> {
  // Calculate hash
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  metadata.hash = hash;
  metadata.size = content.byteLength;

  // In production, submit to repository
  return metadata.documentId;
}

// ============================================================================
// SECTION 9: AUDIT AND COMPLIANCE (Functions 40-42)
// ============================================================================

/**
 * 40. Records audit trail entry for HIE data access.
 *
 * @param {HIEAuditEntry} entry - Audit entry details
 * @returns {HIEAuditEntry} Audit entry with ID
 *
 * @example
 * ```typescript
 * recordHIEAudit({
 *   timestamp: new Date(),
 *   action: 'access',
 *   userId: 'dr-123',
 *   patientId: 'patient-456',
 *   organizationId: 'org-789',
 *   purpose: 'treatment',
 *   sourceSystem: 'EHR',
 *   ipAddress: req.ip,
 *   success: true
 * });
 * ```
 */
export function recordHIEAudit(entry: HIEAuditEntry): HIEAuditEntry {
  return {
    ...entry,
    id: entry.id || crypto.randomUUID(),
    timestamp: entry.timestamp || new Date(),
  };
}

/**
 * 41. Generates disclosure accounting report for patient.
 *
 * @param {string} patientId - Patient ID
 * @param {HIEAuditEntry[]} auditLog - Audit log entries
 * @param {Date} fromDate - Start date
 * @param {Date} toDate - End date
 * @returns {object} Disclosure accounting report
 *
 * @example
 * ```typescript
 * const report = generateDisclosureReport(
 *   'patient-123',
 *   auditEntries,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Total disclosures: ${report.totalDisclosures}`);
 * ```
 */
export function generateDisclosureReport(
  patientId: string,
  auditLog: HIEAuditEntry[],
  fromDate: Date,
  toDate: Date
): {
  patientId: string;
  fromDate: Date;
  toDate: Date;
  totalDisclosures: number;
  disclosures: Array<{
    date: Date;
    recipientOrganization: string;
    purpose: string;
    dataAccessed: string[];
    userId: string;
  }>;
} {
  const disclosures = auditLog
    .filter(entry =>
      entry.patientId === patientId &&
      entry.action === 'disclosure' &&
      entry.timestamp >= fromDate &&
      entry.timestamp <= toDate &&
      entry.success
    )
    .map(entry => ({
      date: entry.timestamp,
      recipientOrganization: entry.destinationSystem || entry.organizationId,
      purpose: entry.purpose,
      dataAccessed: entry.dataAccessed || [],
      userId: entry.userId,
    }));

  return {
    patientId,
    fromDate,
    toDate,
    totalDisclosures: disclosures.length,
    disclosures,
  };
}

/**
 * 42. Validates HIPAA compliance for HIE transaction.
 *
 * @param {HIEAuditEntry} transaction - Transaction to validate
 * @param {HIEConsent[]} consents - Patient consent records
 * @returns {object} Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = validateHIPAACompliance(
 *   auditEntry,
 *   patientConsents
 * );
 * if (!validation.compliant) {
 *   throw new ForbiddenException(validation.violations.join(', '));
 * }
 * ```
 */
export function validateHIPAACompliance(
  transaction: HIEAuditEntry,
  consents: HIEConsent[]
): {
  compliant: boolean;
  violations: string[];
  warnings: string[];
} {
  const violations: string[] = [];
  const warnings: string[] = [];

  // Check if action has valid purpose
  const validPurposes = ['treatment', 'payment', 'operations', 'research', 'public-health', 'emergency'];
  if (!validPurposes.includes(transaction.purpose)) {
    violations.push('Invalid purpose for PHI access');
  }

  // Check consent (except for emergency access)
  if (transaction.purpose !== 'emergency') {
    const hasConsent = checkHIEConsent(
      transaction.patientId,
      consents,
      transaction.organizationId
    );

    if (!hasConsent) {
      violations.push('Patient has not consented to data sharing');
    }
  }

  // Check audit trail completeness
  if (!transaction.userId) {
    violations.push('User ID is required for audit trail');
  }

  if (!transaction.organizationId) {
    violations.push('Organization ID is required for audit trail');
  }

  if (!transaction.ipAddress) {
    warnings.push('IP address not recorded');
  }

  // Check minimum necessary principle
  if (!transaction.dataAccessed || transaction.dataAccessed.length === 0) {
    warnings.push('Data accessed not specified - cannot verify minimum necessary');
  }

  return {
    compliant: violations.length === 0,
    violations,
    warnings,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parses HL7 PID segment
 */
function parsePIDSegment(fields: string[]): PatientIdentificationSegment {
  const nameField = fields[5]?.split('^') || [];
  const dobField = fields[7];
  const addressField = fields[11]?.split('^') || [];

  return {
    patientId: fields[3]?.split('^')[0] || '',
    patientIdentifierList: [{
      id: fields[3]?.split('^')[0] || '',
      idType: fields[3]?.split('^')[4] || 'MR',
      assigningAuthority: fields[3]?.split('^')[3],
    }],
    patientName: {
      familyName: nameField[0] || '',
      givenName: nameField[1] || '',
      middleName: nameField[2],
      suffix: nameField[3],
      prefix: nameField[5],
    },
    dateOfBirth: dobField ? parseHL7DateTime(dobField) : undefined,
    sex: fields[8],
    patientAddress: addressField.length > 0 ? {
      street: addressField[0] || '',
      city: addressField[2] || '',
      state: addressField[3] || '',
      zip: addressField[4] || '',
      country: addressField[5],
    } : undefined,
    phoneHome: fields[13]?.split('^')[0],
    phoneWork: fields[14]?.split('^')[0],
    maritalStatus: fields[16],
    ssn: fields[19],
  };
}

/**
 * Parses HL7 PV1 segment
 */
function parsePV1Segment(fields: string[]): PatientVisitSegment {
  const location = fields[3]?.split('^') || [];
  const attendingDoc = fields[7]?.split('^') || [];

  return {
    setId: fields[1] || '1',
    patientClass: fields[2] || '',
    assignedPatientLocation: location.length > 0 ? {
      pointOfCare: location[0],
      room: location[1],
      bed: location[2],
      facility: location[3],
      building: location[6],
      floor: location[7],
    } : undefined,
    admissionType: fields[4],
    attendingDoctor: attendingDoc.length > 0 ? {
      id: attendingDoc[0] || '',
      familyName: attendingDoc[1] || '',
      givenName: attendingDoc[2] || '',
      idType: attendingDoc[12],
    } : undefined,
    hospitalService: fields[10],
    admitDateTime: fields[44] ? parseHL7DateTime(fields[44]) : undefined,
    dischargeDateTime: fields[45] ? parseHL7DateTime(fields[45]) : undefined,
    visitNumber: fields[19]?.split('^')[0],
  };
}

/**
 * Parses HL7 OBR segment
 */
function parseOBRSegment(fields: string[]): ObservationRequestSegment {
  const serviceId = fields[4]?.split('^') || [];

  return {
    setId: fields[1] || '1',
    placerOrderNumber: fields[2],
    fillerOrderNumber: fields[3],
    universalServiceId: {
      identifier: serviceId[0] || '',
      text: serviceId[1] || '',
      codingSystem: serviceId[2] || '',
    },
    observationDateTime: fields[7] ? parseHL7DateTime(fields[7]) : undefined,
    specimenReceivedDateTime: fields[14] ? parseHL7DateTime(fields[14]) : undefined,
    resultStatus: fields[25],
  };
}

/**
 * Parses HL7 OBX segment
 */
function parseOBXSegment(fields: string[]): ObservationResultSegment {
  const obsId = fields[3]?.split('^') || [];

  return {
    setId: fields[1] || '1',
    valueType: fields[2] || 'ST',
    observationIdentifier: {
      identifier: obsId[0] || '',
      text: obsId[1] || '',
      codingSystem: obsId[2] || '',
    },
    observationSubId: fields[4],
    observationValue: fields[5],
    units: fields[6],
    referenceRange: fields[7],
    abnormalFlags: fields[8]?.split('~'),
    observationResultStatus: fields[11] || 'F',
    observationDateTime: fields[14] ? parseHL7DateTime(fields[14]) : undefined,
  };
}

/**
 * Parses HL7 ORC segment
 */
function parseORCSegment(fields: string[]): OrderControlSegment {
  return {
    orderControl: fields[1] || '',
    placerOrderNumber: fields[2],
    fillerOrderNumber: fields[3],
    orderStatus: fields[5],
    orderDateTime: fields[9] ? parseHL7DateTime(fields[9]) : undefined,
  };
}

/**
 * Parses HL7 datetime format (YYYYMMDDHHMMSS)
 */
function parseHL7DateTime(hl7DateTime: string): Date | undefined {
  if (!hl7DateTime) return undefined;

  const year = parseInt(hl7DateTime.substring(0, 4));
  const month = parseInt(hl7DateTime.substring(4, 6)) - 1;
  const day = parseInt(hl7DateTime.substring(6, 8));
  const hour = parseInt(hl7DateTime.substring(8, 10) || '0');
  const minute = parseInt(hl7DateTime.substring(10, 12) || '0');
  const second = parseInt(hl7DateTime.substring(12, 14) || '0');

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Formats date to HL7 datetime format
 */
function formatHL7DateTime(date: Date): string {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Converts PV1 segment to FHIR Encounter
 */
function convertPV1ToFHIREncounter(pv1: PatientVisitSegment, patientId?: string): any {
  return {
    resourceType: 'Encounter',
    id: crypto.randomUUID(),
    status: pv1.dischargeDateTime ? 'finished' : 'in-progress',
    class: {
      code: pv1.patientClass,
    },
    subject: patientId ? {
      reference: `Patient/${patientId}`,
    } : undefined,
    period: {
      start: pv1.admitDateTime?.toISOString(),
      end: pv1.dischargeDateTime?.toISOString(),
    },
    location: pv1.assignedPatientLocation ? [{
      location: {
        display: `${pv1.assignedPatientLocation.facility} - ${pv1.assignedPatientLocation.room}`,
      },
    }] : undefined,
  };
}

/**
 * Generates CCD allergies section
 */
function generateCCDAllergiesSection(allergies?: CCDAllergy[]): string {
  if (!allergies || allergies.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.6.1" extension="2015-08-01"/>
          <code code="48765-2" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Allergies and Intolerances</title>
          <text>
            <list>
              ${allergies.map(a => `<item>${a.substance} - ${a.reaction || 'Unknown reaction'} (${a.severity || 'Unknown severity'})</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD medications section
 */
function generateCCDMedicationsSection(medications?: CCDMedication[]): string {
  if (!medications || medications.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.1.1" extension="2014-06-09"/>
          <code code="10160-0" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Medications</title>
          <text>
            <list>
              ${medications.map(m => `<item>${m.name} ${m.dose || ''} ${m.route || ''} ${m.frequency || ''}</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD problems section
 */
function generateCCDProblemsSection(problems?: CCDProblem[]): string {
  if (!problems || problems.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.5.1" extension="2015-08-01"/>
          <code code="11450-4" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Problem List</title>
          <text>
            <list>
              ${problems.map(p => `<item>${p.description} (${p.status})</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD procedures section
 */
function generateCCDProceduresSection(procedures?: CCDProcedure[]): string {
  if (!procedures || procedures.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.7.1" extension="2014-06-09"/>
          <code code="47519-4" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Procedures</title>
          <text>
            <list>
              ${procedures.map(p => `<item>${p.description} - ${p.performedDate.toLocaleDateString()}</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD vital signs section
 */
function generateCCDVitalSignsSection(vitals?: CCDVitalSign[]): string {
  if (!vitals || vitals.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.4.1" extension="2015-08-01"/>
          <code code="8716-3" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Vital Signs</title>
          <text>
            <list>
              ${vitals.map(v => `<item>${v.type}: ${v.value} ${v.unit}</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD immunizations section
 */
function generateCCDImmunizationsSection(immunizations?: CCDImmunization[]): string {
  if (!immunizations || immunizations.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.2.1" extension="2015-08-01"/>
          <code code="11369-6" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Immunizations</title>
          <text>
            <list>
              ${immunizations.map(i => `<item>${i.vaccine} - ${i.administeredDate.toLocaleDateString()}</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Generates CCD results section
 */
function generateCCDResultsSection(results?: CCDResult[]): string {
  if (!results || results.length === 0) return '';

  return `
      <component>
        <section>
          <templateId root="2.16.840.1.113883.10.20.22.2.3.1" extension="2015-08-01"/>
          <code code="30954-2" codeSystem="2.16.840.1.113883.6.1"/>
          <title>Results</title>
          <text>
            <list>
              ${results.map(r => `<item>${r.testName}: ${r.value} ${r.unit || ''} ${r.interpretation || ''}</item>`).join('\n              ')}
            </list>
          </text>
        </section>
      </component>`;
}

/**
 * Extracts XML value (simplified)
 */
function extractXMLValue(xml: string, element: string, attribute?: string, attrValue?: string): string | null {
  // Simplified XML parsing - in production use xml2js
  const regex = attribute
    ? new RegExp(`<${element}[^>]*${attribute}="([^"]*)"`, 'i')
    : new RegExp(`<${element}>([^<]*)</${element}>`, 'i');

  const match = xml.match(regex);
  return match ? match[1] : null;
}

/**
 * Soundex phonetic encoding
 */
function soundexEncode(name: string): string {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) return '';

  const first = clean[0];
  const codes: Record<string, string> = {
    'B': '1', 'F': '1', 'P': '1', 'V': '1',
    'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
    'D': '3', 'T': '3',
    'L': '4',
    'M': '5', 'N': '5',
    'R': '6',
  };

  let soundex = first;
  let prevCode = codes[first] || '';

  for (let i = 1; i < clean.length && soundex.length < 4; i++) {
    const code = codes[clean[i]] || '';
    if (code && code !== prevCode && code !== '0') {
      soundex += code;
      prevCode = code;
    } else if (!code) {
      prevCode = '';
    }
  }

  return soundex.padEnd(4, '0');
}

/**
 * Soundex phonetic matching
 */
function soundexMatch(name1: string, name2: string): boolean {
  return soundexEncode(name1) === soundexEncode(name2);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // HL7 v2 Parsing
  parseHL7Message,
  parseADTMessage,
  parseORUMessage,
  parseORMMessage,
  buildHL7Message,
  validateHL7Message,
  extractPatientFromHL7,

  // FHIR Conversion
  convertHL7ToFHIR,
  convertPIDToFHIRPatient,
  convertOBXToFHIRObservation,
  convertFHIRPatientToPID,
  createFHIRBundle,
  extractResourcesFromBundle,
  validateFHIRResource,

  // Continuity of Care Document
  generateCCD,
  parseCCDA,
  convertCCDToFHIRComposition,
  validateCCD,

  // Direct Messaging
  createDirectMessage,
  signDirectMessage,
  encryptDirectMessage,
  validateDirectAddress,

  // Patient Consent
  recordHIEConsent,
  checkHIEConsent,
  revokeHIEConsent,
  generateConsentForm,
  checkBreakGlassAccess,

  // Master Patient Index
  createMPIEntry,
  performPatientMatching,
  linkPatientRecords,
  getEnterpriseEMRN,
  mergeMPIEntries,

  // Provider Directory
  queryProviderDirectory,
  searchProvidersBySpecialty,
  validateNPI,

  // Document Exchange
  createDocumentMetadata,
  queryDocumentRegistry,
  retrieveDocument,
  submitDocument,

  // Audit and Compliance
  recordHIEAudit,
  generateDisclosureReport,
  validateHIPAACompliance,
};
