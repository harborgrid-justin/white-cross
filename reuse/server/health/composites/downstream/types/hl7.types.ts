/**
 * HL7 v2 Message Types
 *
 * Type definitions for HL7 v2.x message processing, parsing, and generation.
 * Supports ADT, ORU, ORM, DFT, SIU, and other common HL7 message types.
 *
 * @module hl7.types
 * @since 1.0.0
 */

import { Gender } from './common.types';

/**
 * HL7 v2 message structure
 *
 * @example
 * ```typescript
 * const message: HL7v2Message = {
 *   messageType: 'ADT',
 *   eventType: 'A01',
 *   messageControlId: 'MSG-123',
 *   sendingApplication: 'EPIC',
 *   receivingApplication: 'LAB',
 *   timestamp: new Date(),
 *   version: '2.5',
 *   segments: [...]
 * };
 * ```
 */
export interface HL7v2Message {
  /** Message type (ADT, ORU, ORM, etc.) */
  messageType: HL7MessageType;

  /** Event type (A01, A03, R01, etc.) */
  eventType: string;

  /** Unique message control ID */
  messageControlId: string;

  /** Sending application */
  sendingApplication: string;

  /** Sending facility */
  sendingFacility?: string;

  /** Receiving application */
  receivingApplication: string;

  /** Receiving facility */
  receivingFacility?: string;

  /** Message timestamp */
  timestamp: Date;

  /** HL7 version (2.3, 2.4, 2.5, 2.6, etc.) */
  version: string;

  /** Raw message segments */
  segments: string[];

  /** Parsed segments */
  parsedSegments?: Record<string, HL7Segment>;

  /** Processing status */
  processingStatus?: 'received' | 'processing' | 'processed' | 'error';

  /** Processing errors */
  processingErrors?: string[];
}

/**
 * HL7 message types
 */
export type HL7MessageType =
  | 'ADT'  // Admission, Discharge, Transfer
  | 'ORU'  // Observation Result (Lab results, radiology)
  | 'ORM'  // Order Message (Lab orders, medication orders)
  | 'DFT'  // Detailed Financial Transaction
  | 'SIU'  // Scheduling Information Unsolicited
  | 'MDM'  // Medical Document Management
  | 'BAR'  // Billing Account Record
  | 'VXU'  // Vaccination Update
  | 'ACK'  // General Acknowledgment
  | 'QRY'  // Query
  | 'QBP'  // Query by Parameter
  | 'RSP'; // Response

/**
 * HL7 segment (generic structure)
 *
 * @example
 * ```typescript
 * const segment: HL7Segment = {
 *   segmentType: 'PID',
 *   fields: ['PID', '', 'MRN123^^^FACILITY', ...]
 * };
 * ```
 */
export interface HL7Segment {
  /** Segment type (PID, PV1, OBX, etc.) */
  segmentType: string;

  /** Segment fields */
  fields: string[];

  /** Field separator (usually |) */
  fieldSeparator?: string;

  /** Component separator (usually ^) */
  componentSeparator?: string;

  /** Repetition separator (usually ~) */
  repetitionSeparator?: string;

  /** Escape character (usually \) */
  escapeCharacter?: string;

  /** Subcomponent separator (usually &) */
  subcomponentSeparator?: string;
}

/**
 * HL7 patient demographics (PID segment)
 *
 * @example
 * ```typescript
 * const demographics: HL7PatientDemographics = {
 *   patientId: 'MRN123',
 *   identifierType: 'MRN',
 *   assigningAuthority: 'FACILITY',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: new Date('1980-05-15'),
 *   gender: 'male'
 * };
 * ```
 */
export interface HL7PatientDemographics {
  /** Patient identifier */
  patientId: string;

  /** Identifier type (MRN, SSN, etc.) */
  identifierType?: string;

  /** Assigning authority */
  assigningAuthority?: string;

  /** First name */
  firstName: string;

  /** Middle name */
  middleName?: string;

  /** Last name */
  lastName: string;

  /** Suffix */
  suffix?: string;

  /** Date of birth */
  dateOfBirth: Date;

  /** Gender */
  gender: Gender;

  /** Race */
  race?: string;

  /** Address */
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };

  /** Phone numbers */
  phoneHome?: string;
  phoneWork?: string;
  phoneMobile?: string;

  /** Marital status */
  maritalStatus?: string;

  /** SSN */
  ssn?: string;

  /** Mother's maiden name */
  mothersMaidenName?: string;
}

/**
 * Visit information (PV1 segment)
 *
 * @example
 * ```typescript
 * const visit: VisitInformation = {
 *   patientClass: 'INPATIENT',
 *   assignedPatientLocation: '3E-315',
 *   admissionType: 'ELECTIVE',
 *   attendingDoctor: 'Smith^John^MD',
 *   admitDateTime: new Date('2025-11-10T08:00:00')
 * };
 * ```
 */
export interface VisitInformation {
  /** Patient class (INPATIENT, OUTPATIENT, EMERGENCY, etc.) */
  patientClass: string;

  /** Assigned patient location (room/bed) */
  assignedPatientLocation: string;

  /** Admission type */
  admissionType?: string;

  /** Attending doctor */
  attendingDoctor?: string;

  /** Referring doctor */
  referringDoctor?: string;

  /** Consulting doctor */
  consultingDoctor?: string;

  /** Hospital service */
  hospitalService?: string;

  /** Admit date/time */
  admitDateTime: Date;

  /** Discharge date/time */
  dischargeDateTime?: Date;

  /** Visit number */
  visitNumber?: string;

  /** Account number */
  accountNumber?: string;

  /** Admission source */
  admissionSource?: string;

  /** Discharge disposition */
  dischargeDisposition?: string;
}

/**
 * ADT (Admission, Discharge, Transfer) event action
 */
export type ADTAction =
  | 'admit'
  | 'transfer'
  | 'discharge'
  | 'register'
  | 'pre-admit'
  | 'update'
  | 'cancel_admit'
  | 'cancel_transfer'
  | 'cancel_discharge'
  | 'merge'
  | 'unknown';

/**
 * ADT processing result
 *
 * @example
 * ```typescript
 * const result: ADTProcessingResult = {
 *   messageType: 'ADT',
 *   eventType: 'A01',
 *   patient: {...},
 *   visit: {...},
 *   action: 'admit'
 * };
 * ```
 */
export interface ADTProcessingResult {
  /** Message type */
  messageType: 'ADT';

  /** Event type (A01, A02, A03, etc.) */
  eventType: string;

  /** Patient demographics */
  patient: HL7PatientDemographics | null;

  /** Visit information */
  visit: VisitInformation | null;

  /** Action taken */
  action: ADTAction;

  /** Event occurred date/time */
  eventOccurred?: string;

  /** Event recorded date/time */
  eventRecorded?: string;
}

/**
 * HL7 observation (OBX segment) for lab results
 *
 * @example
 * ```typescript
 * const observation: HL7Observation = {
 *   setId: 1,
 *   valueType: 'NM',
 *   identifier: 'GLU',
 *   observationName: 'Glucose',
 *   value: '105',
 *   units: 'mg/dL',
 *   referenceRange: '70-110',
 *   abnormalFlags: '',
 *   observationDateTime: new Date()
 * };
 * ```
 */
export interface HL7Observation {
  /** Set ID */
  setId: number;

  /** Value type (NM=numeric, ST=string, TX=text, etc.) */
  valueType: string;

  /** Observation identifier */
  identifier: string;

  /** Observation name/description */
  observationName: string;

  /** Observation value */
  value: string;

  /** Units of measure */
  units?: string;

  /** Reference range */
  referenceRange?: string;

  /** Abnormal flags (H=high, L=low, etc.) */
  abnormalFlags?: string;

  /** Result status (F=final, P=preliminary, C=corrected) */
  resultStatus?: string;

  /** Observation date/time */
  observationDateTime?: Date;

  /** Performing organization */
  performingOrganization?: string;

  /** Producer ID */
  producerId?: string;

  /** Notes/comments */
  notes?: string[];
}

/**
 * ORU (Observation Result) processing result
 *
 * @example
 * ```typescript
 * const result: ORUProcessingResult = {
 *   messageType: 'ORU',
 *   eventType: 'R01',
 *   patient: {...},
 *   orderNumber: 'ORD-123',
 *   observations: [...]
 * };
 * ```
 */
export interface ORUProcessingResult {
  /** Message type */
  messageType: 'ORU';

  /** Event type (R01, R03, etc.) */
  eventType: string;

  /** Patient demographics */
  patient: HL7PatientDemographics | null;

  /** Order number */
  orderNumber?: string;

  /** Filler order number */
  fillerOrderNumber?: string;

  /** Universal service ID */
  universalServiceId?: string;

  /** Observation date/time */
  observationDateTime?: Date;

  /** Ordering provider */
  orderingProvider?: string;

  /** Result status */
  resultStatus?: string;

  /** Observations */
  observations: HL7Observation[];

  /** Notes and comments */
  notes?: string[];
}

/**
 * ORM (Order Message) processing result
 *
 * @example
 * ```typescript
 * const result: ORMProcessingResult = {
 *   messageType: 'ORM',
 *   eventType: 'O01',
 *   patient: {...},
 *   orderNumber: 'ORD-123',
 *   orderControl: 'NW',
 *   orderDetails: {...}
 * };
 * ```
 */
export interface ORMProcessingResult {
  /** Message type */
  messageType: 'ORM';

  /** Event type (O01, O02, etc.) */
  eventType: string;

  /** Patient demographics */
  patient: HL7PatientDemographics | null;

  /** Placer order number */
  orderNumber: string;

  /** Filler order number */
  fillerOrderNumber?: string;

  /** Order control (NW=new, CA=cancel, OC=order canceled, etc.) */
  orderControl: string;

  /** Universal service ID */
  universalServiceId?: string;

  /** Order details */
  orderDetails?: {
    quantity?: string;
    orderingProvider?: string;
    orderDateTime?: Date;
    specimenSource?: string;
    priority?: string;
    orderStatus?: string;
  };
}

/**
 * HL7 acknowledgment (ACK) message
 *
 * @example
 * ```typescript
 * const ack: HL7Acknowledgment = {
 *   messageControlId: 'MSG-123',
 *   acknowledgmentCode: 'AA',
 *   textMessage: 'Message accepted',
 *   timestamp: new Date()
 * };
 * ```
 */
export interface HL7Acknowledgment {
  /** Original message control ID */
  messageControlId: string;

  /** Acknowledgment code (AA, AE, AR, CA, CE, CR) */
  acknowledgmentCode: 'AA' | 'AE' | 'AR' | 'CA' | 'CE' | 'CR';

  /** Text message */
  textMessage?: string;

  /** Error condition */
  errorCondition?: string;

  /** Timestamp */
  timestamp: Date;

  /** HL7 version */
  version?: string;
}

/**
 * HL7 message parsing result
 *
 * @example
 * ```typescript
 * const parseResult: HL7ParseResult = {
 *   success: true,
 *   message: {...},
 *   errors: []
 * };
 * ```
 */
export interface HL7ParseResult {
  /** Whether parsing succeeded */
  success: boolean;

  /** Parsed message (if successful) */
  message?: HL7v2Message;

  /** Parsing errors */
  errors: string[];

  /** Warnings */
  warnings?: string[];

  /** Raw message text */
  rawMessage?: string;
}

/**
 * HL7 message generation request
 *
 * @example
 * ```typescript
 * const request: HL7GenerationRequest = {
 *   messageType: 'ADT',
 *   eventType: 'A01',
 *   patient: {...},
 *   visit: {...},
 *   sendingApplication: 'EPIC',
 *   receivingApplication: 'LAB'
 * };
 * ```
 */
export interface HL7GenerationRequest {
  /** Message type */
  messageType: HL7MessageType;

  /** Event type */
  eventType: string;

  /** Patient demographics */
  patient: HL7PatientDemographics;

  /** Visit information */
  visit?: VisitInformation;

  /** Observations (for ORU messages) */
  observations?: HL7Observation[];

  /** Order details (for ORM messages) */
  orderDetails?: Record<string, unknown>;

  /** Sending application */
  sendingApplication: string;

  /** Sending facility */
  sendingFacility?: string;

  /** Receiving application */
  receivingApplication: string;

  /** Receiving facility */
  receivingFacility?: string;

  /** HL7 version */
  version?: string;
}

/**
 * HL7 message generation result
 *
 * @example
 * ```typescript
 * const result: HL7GenerationResult = {
 *   success: true,
 *   message: 'MSH|^~\\&|EPIC|...',
 *   messageControlId: 'MSG-123'
 * };
 * ```
 */
export interface HL7GenerationResult {
  /** Whether generation succeeded */
  success: boolean;

  /** Generated HL7 message text */
  message?: string;

  /** Message control ID */
  messageControlId?: string;

  /** Generation errors */
  errors?: string[];

  /** Warnings */
  warnings?: string[];
}
