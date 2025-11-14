import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { PrescriptionStatus } from '../enums/prescription-status.enum';
import { NoteType } from '../enums/note-type.enum';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';

/**
 * Vital Signs Response DTO
 *
 * Represents vital signs measurements recorded during a clinical visit.
 * Includes comprehensive biometric data with abnormality flags for clinical monitoring.
 *
 * @remarks
 * - All measurements are optional to accommodate partial vital sign recordings
 * - BMI is automatically calculated when height and weight are present
 * - Abnormal flags are system-generated based on clinical thresholds
 * - Used for trending patient health data over time
 *
 * @since 1.0.0
 * @see {@link VitalSigns} for the underlying Sequelize model
 */
@Exclude()
export class VitalSignsResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the vital signs record',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student ID this vital signs record belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Date and time when vital signs were measured',
    example: '2025-11-14T10:30:00Z',
    type: Date,
  })
  measurementDate: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Body temperature reading',
    example: 98.6,
    minimum: 90,
    maximum: 110,
    type: Number,
  })
  temperature?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Temperature unit of measurement',
    example: 'F',
    enum: ['F', 'C'],
    default: 'F',
  })
  temperatureUnit?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Heart rate in beats per minute (bpm)',
    example: 72,
    minimum: 30,
    maximum: 220,
    type: Number,
  })
  heartRate?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Respiratory rate in breaths per minute',
    example: 16,
    minimum: 8,
    maximum: 60,
    type: Number,
  })
  respiratoryRate?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Systolic blood pressure in mmHg (upper number)',
    example: 120,
    minimum: 60,
    maximum: 250,
    type: Number,
  })
  bloodPressureSystolic?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Diastolic blood pressure in mmHg (lower number)',
    example: 80,
    minimum: 40,
    maximum: 150,
    type: Number,
  })
  bloodPressureDiastolic?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Oxygen saturation percentage (SpO2)',
    example: 98,
    minimum: 70,
    maximum: 100,
    type: Number,
  })
  oxygenSaturation?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Body weight measurement',
    example: 150,
    type: Number,
  })
  weight?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Weight unit of measurement',
    example: 'lbs',
    enum: ['lbs', 'kg'],
    default: 'lbs',
  })
  weightUnit?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Height measurement',
    example: 68,
    type: Number,
  })
  height?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Height unit of measurement',
    example: 'inches',
    enum: ['inches', 'cm'],
    default: 'inches',
  })
  heightUnit?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Body Mass Index (BMI) - automatically calculated from height and weight',
    example: 22.8,
    type: Number,
  })
  bmi?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Pain level on 0-10 scale (0 = no pain, 10 = worst pain)',
    example: 3,
    minimum: 0,
    maximum: 10,
    type: Number,
  })
  pain?: number;

  @Expose()
  @ApiProperty({
    description: 'Indicates if any vital signs are outside normal ranges',
    example: false,
    type: Boolean,
  })
  isAbnormal: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Array of specific vital signs that are abnormal',
    example: ['temperature', 'heartRate'],
    type: [String],
    isArray: true,
  })
  abnormalFlags?: string[];

  @Expose()
  @ApiPropertyOptional({
    description: 'Name or ID of staff member who measured the vital signs',
    example: 'Nurse Jane Smith',
  })
  measuredBy?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Additional clinical notes or observations',
    example: 'Patient appeared alert and oriented x3',
  })
  notes?: string;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when record was created',
    example: '2025-11-14T10:30:00Z',
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when record was last updated',
    example: '2025-11-14T10:30:00Z',
    type: Date,
  })
  updatedAt: Date;
}

/**
 * Clinical Note Response DTO
 *
 * Represents a clinical note created during or after a patient visit.
 * Supports multiple note types including SOAP notes (Subjective, Objective, Assessment, Plan),
 * progress notes, discharge summaries, and other clinical documentation.
 *
 * @remarks
 * - SOAP notes require all four components (S.O.A.P) to be considered complete
 * - Notes can be marked confidential for sensitive information
 * - Digital signature workflow tracks when notes are signed and by whom
 * - Amendment tracking maintains audit trail for modified notes
 * - Tags enable categorization and filtering of clinical documentation
 *
 * @example
 * ```typescript
 * const soapNote: ClinicalNoteResponseDto = {
 *   id: '...',
 *   type: NoteType.SOAP,
 *   subjective: 'Patient complains of headache x3 days',
 *   objective: 'Temp 98.6F, BP 120/80, alert and oriented',
 *   assessment: 'Tension headache, likely stress-related',
 *   plan: 'OTC ibuprofen 400mg q6h PRN, follow up in 1 week',
 *   isSigned: true,
 *   signedAt: new Date('2025-11-14T15:00:00Z')
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link ClinicalNote} for the underlying Sequelize model
 * @see {@link NoteType} for available note type categories
 */
@Exclude()
export class ClinicalNoteResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the clinical note',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student ID this clinical note belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated clinic visit ID',
    example: '789e0123-e45b-67c8-d901-234567890abc',
    format: 'uuid',
    nullable: true,
  })
  visitId?: string;

  @Expose()
  @ApiProperty({
    description: 'Type of clinical note',
    example: NoteType.SOAP,
    enum: NoteType,
  })
  type: NoteType;

  @Expose()
  @ApiProperty({
    description: 'User ID of the note author (provider/nurse)',
    example: '456e7890-a12b-34c5-d678-901234567def',
    format: 'uuid',
  })
  createdBy: string;

  @Expose()
  @ApiProperty({
    description: 'Note title/subject line',
    example: 'Follow-up Visit - Headache Management',
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: 'Main note content/body',
    example: 'Patient presents for follow-up visit regarding ongoing headaches...',
  })
  content: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Subjective component of SOAP note - patient\'s reported symptoms and concerns',
    example: 'Patient complains of persistent headaches for the past 3 days, worse in the morning',
    nullable: true,
  })
  subjective?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Objective component of SOAP note - observable/measurable findings',
    example: 'Vital signs: T 98.6F, BP 120/80, HR 72, RR 16. Patient alert and oriented x3',
    nullable: true,
  })
  objective?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Assessment component of SOAP note - clinical diagnosis/impression',
    example: 'Tension headache, likely stress-related. No signs of migraine or neurological deficit',
    nullable: true,
  })
  assessment?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Plan component of SOAP note - treatment plan and follow-up',
    example: 'OTC ibuprofen 400mg q6h PRN. Encourage stress management. Follow up in 1 week if not improved',
    nullable: true,
  })
  plan?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Categorical tags for note organization and filtering',
    example: ['headache', 'follow-up', 'medication'],
    type: [String],
    isArray: true,
    nullable: true,
  })
  tags?: string[];

  @Expose()
  @ApiProperty({
    description: 'Indicates if note contains sensitive/confidential information requiring restricted access',
    example: false,
    type: Boolean,
  })
  isConfidential: boolean;

  @Expose()
  @ApiProperty({
    description: 'Indicates if note has been digitally signed by the author',
    example: true,
    type: Boolean,
  })
  isSigned: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Timestamp when note was digitally signed',
    example: '2025-11-14T15:00:00Z',
    type: Date,
    nullable: true,
  })
  signedAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'Indicates if note has been amended after initial signing',
    example: false,
    type: Boolean,
  })
  amended: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Reason/justification for amendment (required when amended=true)',
    example: 'Added clarification regarding medication dosage',
    nullable: true,
  })
  amendmentReason?: string;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when note was created',
    example: '2025-11-14T14:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when note was last updated',
    example: '2025-11-14T14:30:00Z',
    type: Date,
  })
  updatedAt: Date;
}

/**
 * Prescription Response DTO
 *
 * Comprehensive prescription data transfer object containing complete pharmaceutical
 * information for e-prescribing, pharmacy fulfillment, and medication tracking.
 *
 * @remarks
 * **NDC Code Format:**
 * - National Drug Code (NDC) is an FDA identifier for drugs marketed in the US
 * - Format: XXXXX-XXXX-XX or XXXX-XXXX-XX (labeler-product-package)
 * - Example: `00093-4155-73` (Amoxicillin 500mg capsules)
 * - Validated using regex pattern: `/^\d{4,5}-\d{4}-\d{1,2}$/`
 *
 * **Route of Administration Examples:**
 * - `oral` - Swallowed medications (tablets, capsules, liquids)
 * - `topical` - Applied to skin (creams, ointments, patches)
 * - `sublingual` - Under the tongue
 * - `injection` - IM (intramuscular), IV (intravenous), SC (subcutaneous)
 * - `inhalation` - Inhaled medications (inhalers, nebulizers)
 * - `ophthalmic` - Eye drops/ointments
 * - `otic` - Ear drops
 * - `rectal` - Suppositories, enemas
 * - `transdermal` - Skin patches for systemic delivery
 *
 * **Frequency Examples:**
 * - `QD` or `once daily` - Once per day
 * - `BID` or `twice daily` - Twice per day
 * - `TID` or `three times daily` - Three times per day
 * - `QID` or `four times daily` - Four times per day
 * - `Q4H` - Every 4 hours
 * - `Q6H` - Every 6 hours
 * - `PRN` - As needed
 * - `BID PRN` - Up to twice daily as needed
 * - `QHS` - At bedtime
 * - `AC` - Before meals
 * - `PC` - After meals
 *
 * **Prescription Status Workflow:**
 * 1. `PENDING` - Prescription written but not sent to pharmacy
 * 2. `SENT` - Sent to pharmacy electronically or called in
 * 3. `FILLED` - Pharmacy has prepared the medication
 * 4. `PARTIALLY_FILLED` - Only part of prescribed quantity filled (e.g., controlled substances)
 * 5. `PICKED_UP` - Patient has collected the medication
 * 6. `CANCELLED` - Prescription cancelled before filling
 * 7. `EXPIRED` - Past end date or expiration period
 *
 * **Refill Tracking:**
 * - `refillsAuthorized` - Total refills approved by prescriber
 * - `refillsUsed` - Number of refills already filled
 * - Remaining refills = refillsAuthorized - refillsUsed
 * - DEA regulations limit refills for controlled substances (e.g., Schedule II = 0 refills)
 *
 * **Controlled Substance Notes:**
 * - Schedule II drugs (e.g., oxycodone, methylphenidate) require special handling
 * - No refills permitted for Schedule II - new prescription required
 * - Schedule III-V drugs may have limited refills (typically max 5 in 6 months)
 * - All controlled substance prescriptions tracked for DEA compliance
 *
 * @example
 * ```typescript
 * const prescription: PrescriptionResponseDto = {
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   studentId: '123e4567-...',
 *   prescribedBy: '456e7890-...',
 *   drugName: 'Amoxicillin',
 *   drugCode: '00093-4155-73',
 *   dosage: '500mg',
 *   frequency: 'TID',
 *   route: 'oral',
 *   quantity: 30,
 *   quantityFilled: 30,
 *   refillsAuthorized: 2,
 *   refillsUsed: 0,
 *   status: PrescriptionStatus.PICKED_UP,
 *   startDate: new Date('2025-11-14'),
 *   endDate: new Date('2025-11-24'),
 *   instructions: 'Take with food to reduce stomach upset',
 *   pharmacyName: 'CVS Pharmacy #1234',
 *   filledDate: new Date('2025-11-14T10:00:00Z'),
 *   pickedUpDate: new Date('2025-11-14T15:30:00Z')
 * };
 *
 * // Check virtual methods
 * const isActive = prescription.isActive; // true
 * const hasRefills = prescription.hasRefillsRemaining; // true
 * const remaining = prescription.remainingRefills; // 2
 * const daysSupply = prescription.daysSupply; // 10
 * ```
 *
 * @since 1.0.0
 * @see {@link Prescription} for the underlying Sequelize model
 * @see {@link PrescriptionStatus} for status enum values
 * @see {@link https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory} NDC Directory
 * @see {@link https://www.deadiversion.usdoj.gov/schedules/} DEA Drug Schedules
 */
@Exclude()
export class PrescriptionResponseDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the prescription',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student ID (patient) this prescription is for',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated clinic visit ID where prescription was written',
    example: '789e0123-e45b-67c8-d901-234567890abc',
    format: 'uuid',
    nullable: true,
  })
  visitId?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated treatment plan ID if part of ongoing treatment',
    example: '012e3456-f78g-90h1-i234-567890123jkl',
    format: 'uuid',
    nullable: true,
  })
  treatmentPlanId?: string;

  @Expose()
  @ApiProperty({
    description: 'User ID of the prescribing provider (physician, NP, PA)',
    example: '456e7890-a12b-34c5-d678-901234567def',
    format: 'uuid',
  })
  prescribedBy: string;

  @Expose()
  @ApiProperty({
    description: 'Generic or brand name of the medication',
    example: 'Amoxicillin',
  })
  drugName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'National Drug Code (NDC) in format XXXXX-XXXX-XX or XXXX-XXXX-XX. FDA identifier for specific drug product.',
    example: '00093-4155-73',
    pattern: '^\\d{4,5}-\\d{4}-\\d{1,2}$',
    nullable: true,
  })
  drugCode?: string;

  @Expose()
  @ApiProperty({
    description: 'Dosage strength and form (e.g., 500mg, 10mg/5mL, 0.5mg)',
    example: '500mg',
  })
  dosage: string;

  @Expose()
  @ApiProperty({
    description: 'Frequency of administration using medical abbreviations or plain language',
    example: 'TID (three times daily)',
  })
  frequency: string;

  @Expose()
  @ApiProperty({
    description: 'Route of administration - how the medication is given to the patient',
    example: 'oral',
    enum: [
      'oral',
      'topical',
      'sublingual',
      'injection',
      'IM',
      'IV',
      'SC',
      'inhalation',
      'ophthalmic',
      'otic',
      'rectal',
      'transdermal',
      'nasal',
      'vaginal',
    ],
  })
  route: string;

  @Expose()
  @ApiProperty({
    description: 'Total quantity of medication units prescribed (tablets, mL, etc.)',
    example: 30,
    minimum: 1,
    type: Number,
  })
  quantity: number;

  @Expose()
  @ApiProperty({
    description: 'Actual quantity dispensed by pharmacy (may differ from quantity for partial fills)',
    example: 30,
    minimum: 0,
    type: Number,
  })
  quantityFilled: number;

  @Expose()
  @ApiProperty({
    description: 'Number of refills authorized by prescriber (0 = no refills)',
    example: 2,
    minimum: 0,
    type: Number,
  })
  refillsAuthorized: number;

  @Expose()
  @ApiProperty({
    description: 'Number of refills already used/filled',
    example: 0,
    minimum: 0,
    type: Number,
  })
  refillsUsed: number;

  @Expose()
  @ApiProperty({
    description: 'Date when prescription becomes valid/active (YYYY-MM-DD)',
    example: '2025-11-14',
    type: Date,
  })
  startDate: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date when prescription expires or therapy should end (YYYY-MM-DD)',
    example: '2025-11-24',
    type: Date,
    nullable: true,
  })
  endDate?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Special instructions for patient (e.g., "Take with food", "Avoid alcohol")',
    example: 'Take with food to reduce stomach upset. Complete entire course even if feeling better.',
    nullable: true,
  })
  instructions?: string;

  @Expose()
  @ApiProperty({
    description: 'Current status of prescription in the fulfillment workflow',
    example: PrescriptionStatus.PICKED_UP,
    enum: PrescriptionStatus,
  })
  status: PrescriptionStatus;

  @Expose()
  @ApiPropertyOptional({
    description: 'Name and optional location of pharmacy filling the prescription',
    example: 'CVS Pharmacy #1234 - Main Street',
    nullable: true,
  })
  pharmacyName?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date and time when pharmacy filled the prescription',
    example: '2025-11-14T10:00:00Z',
    type: Date,
    nullable: true,
  })
  filledDate?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Date and time when patient picked up the medication from pharmacy',
    example: '2025-11-14T15:30:00Z',
    type: Date,
    nullable: true,
  })
  pickedUpDate?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'Clinical notes, pharmacy notes, or special handling instructions',
    example: 'Patient allergic to penicillin - verified safe alternative',
    nullable: true,
  })
  notes?: string;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when prescription was created in system',
    example: '2025-11-14T09:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when prescription was last modified',
    example: '2025-11-14T15:30:00Z',
    type: Date,
  })
  updatedAt: Date;

  // Virtual/computed fields from model methods

  @Expose()
  @ApiProperty({
    description: 'Indicates if prescription is currently active (FILLED or PICKED_UP status, not expired)',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Indicates if prescription has unused refills remaining',
    example: true,
    type: Boolean,
  })
  hasRefillsRemaining: boolean;

  @Expose()
  @ApiProperty({
    description: 'Number of refills remaining (refillsAuthorized - refillsUsed)',
    example: 2,
    minimum: 0,
    type: Number,
  })
  remainingRefills: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Calculated days supply from start to end date (null if no end date)',
    example: 10,
    minimum: 0,
    type: Number,
    nullable: true,
  })
  daysSupply?: number | null;

  // Optional associations

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated student/patient record',
    type: () => Object,
    nullable: true,
  })
  student?: any;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated clinic visit record',
    type: () => Object,
    nullable: true,
  })
  visit?: any;

  @Expose()
  @ApiPropertyOptional({
    description: 'Associated treatment plan record',
    type: () => Object,
    nullable: true,
  })
  treatmentPlan?: any;

  @Expose()
  @ApiPropertyOptional({
    description: 'Prescriber user record (physician, NP, PA)',
    type: () => Object,
    nullable: true,
  })
  prescriber?: any;
}

/**
 * Prescription Summary DTO
 *
 * Lightweight prescription data transfer object for list views and quick reference.
 * Contains essential fields without associations or computed values for optimized performance.
 *
 * @remarks
 * - Use for prescription lists, dropdowns, and search results
 * - Excludes heavy fields like instructions, notes, and associations
 * - Includes only critical pharmacy workflow fields
 * - Optimized for API responses with many prescriptions
 *
 * @example
 * ```typescript
 * const summary: PrescriptionSummaryDto = {
 *   id: '550e8400-...',
 *   drugName: 'Amoxicillin',
 *   dosage: '500mg',
 *   frequency: 'TID',
 *   status: PrescriptionStatus.PICKED_UP,
 *   startDate: new Date('2025-11-14'),
 *   remainingRefills: 2
 * };
 * ```
 *
 * @since 1.0.0
 * @see {@link PrescriptionResponseDto} for complete prescription details
 */
@Exclude()
export class PrescriptionSummaryDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the prescription',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Student ID this prescription belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  studentId: string;

  @Expose()
  @ApiProperty({
    description: 'Medication name',
    example: 'Amoxicillin',
  })
  drugName: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'National Drug Code (NDC)',
    example: '00093-4155-73',
    nullable: true,
  })
  drugCode?: string;

  @Expose()
  @ApiProperty({
    description: 'Dosage strength',
    example: '500mg',
  })
  dosage: string;

  @Expose()
  @ApiProperty({
    description: 'Frequency of administration',
    example: 'TID',
  })
  frequency: string;

  @Expose()
  @ApiProperty({
    description: 'Route of administration',
    example: 'oral',
  })
  route: string;

  @Expose()
  @ApiProperty({
    description: 'Prescription status',
    example: PrescriptionStatus.PICKED_UP,
    enum: PrescriptionStatus,
  })
  status: PrescriptionStatus;

  @Expose()
  @ApiProperty({
    description: 'Start date',
    example: '2025-11-14',
    type: Date,
  })
  startDate: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'End date',
    example: '2025-11-24',
    type: Date,
    nullable: true,
  })
  endDate?: Date;

  @Expose()
  @ApiProperty({
    description: 'Refills remaining',
    example: 2,
    type: Number,
  })
  remainingRefills: number;

  @Expose()
  @ApiProperty({
    description: 'Is prescription currently active',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Timestamp when created',
    example: '2025-11-14T09:00:00Z',
    type: Date,
  })
  createdAt: Date;
}

/**
 * Prescription List Response DTO
 *
 * Paginated list response for prescription queries with metadata.
 * Uses the standardized pagination format for consistent API responses.
 *
 * @remarks
 * - Returns PrescriptionSummaryDto for performance optimization
 * - Use PaginationQueryDto for query parameters
 * - Includes total count for client-side pagination controls
 * - Compatible with all standard list operations
 *
 * @example
 * ```typescript
 * // Controller usage
 * @Get()
 * @ApiOkResponse({ type: PrescriptionListResponseDto })
 * async findAll(@Query() query: PaginationQueryDto): Promise<PrescriptionListResponseDto> {
 *   return this.prescriptionService.findAll(query);
 * }
 *
 * // Response format
 * {
 *   data: [
 *     { id: '...', drugName: 'Amoxicillin', ... },
 *     { id: '...', drugName: 'Ibuprofen', ... }
 *   ],
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 45,
 *     pages: 3,
 *     hasNext: true,
 *     hasPrev: false
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link PaginatedResponseDto} for pagination structure
 * @see {@link PrescriptionSummaryDto} for list item structure
 */
export class PrescriptionListResponseDto extends PaginatedResponseDto<PrescriptionSummaryDto> {
  @ApiProperty({
    description: 'Array of prescription summaries for current page',
    type: [PrescriptionSummaryDto],
    isArray: true,
  })
  @Type(() => PrescriptionSummaryDto)
  declare data: PrescriptionSummaryDto[];
}

// ============================================================================
// Mapper Functions
// ============================================================================

/**
 * Map Prescription model to PrescriptionResponseDto
 *
 * Converts a Sequelize Prescription model instance to a complete response DTO
 * including computed virtual method values and optional associations.
 *
 * @template TInclude - Type of included associations
 * @param {Prescription} prescription - Sequelize Prescription model instance
 * @returns {PrescriptionResponseDto} Mapped response DTO with all fields
 *
 * @remarks
 * - Calls model instance methods for computed fields (isActive, hasRefillsRemaining, etc.)
 * - Preserves associations if loaded (student, visit, treatmentPlan, prescriber)
 * - Handles null/undefined values appropriately for optional fields
 * - Virtual fields are computed at runtime from model state
 *
 * @example
 * ```typescript
 * // In service layer
 * const prescription = await this.prescriptionModel.findByPk(id, {
 *   include: ['student', 'prescriber']
 * });
 * const dto = mapPrescriptionToResponseDto(prescription);
 * return dto;
 * ```
 *
 * @since 1.0.0
 */
export function mapPrescriptionToResponseDto(prescription: any): PrescriptionResponseDto {
  return {
    id: prescription.id,
    studentId: prescription.studentId,
    visitId: prescription.visitId,
    treatmentPlanId: prescription.treatmentPlanId,
    prescribedBy: prescription.prescribedBy,
    drugName: prescription.drugName,
    drugCode: prescription.drugCode,
    dosage: prescription.dosage,
    frequency: prescription.frequency,
    route: prescription.route,
    quantity: prescription.quantity,
    quantityFilled: prescription.quantityFilled,
    refillsAuthorized: prescription.refillsAuthorized,
    refillsUsed: prescription.refillsUsed,
    startDate: prescription.startDate,
    endDate: prescription.endDate,
    instructions: prescription.instructions,
    status: prescription.status,
    pharmacyName: prescription.pharmacyName,
    filledDate: prescription.filledDate,
    pickedUpDate: prescription.pickedUpDate,
    notes: prescription.notes,
    createdAt: prescription.createdAt,
    updatedAt: prescription.updatedAt,
    // Virtual/computed fields from model methods
    isActive: prescription.isActive(),
    hasRefillsRemaining: prescription.hasRefillsRemaining(),
    remainingRefills: prescription.getRemainingRefills(),
    daysSupply: prescription.getDaysSupply(),
    // Optional associations
    student: prescription.student,
    visit: prescription.visit,
    treatmentPlan: prescription.treatmentPlan,
    prescriber: prescription.prescriber,
  };
}

/**
 * Map Prescription model to PrescriptionSummaryDto
 *
 * Converts a Prescription model to a lightweight summary DTO for list views.
 * Excludes heavy fields and associations for optimized API responses.
 *
 * @param {Prescription} prescription - Sequelize Prescription model instance
 * @returns {PrescriptionSummaryDto} Mapped summary DTO
 *
 * @remarks
 * - Only includes essential fields for display in lists
 * - Computes virtual fields for quick reference
 * - No associations are included
 * - Optimized for bulk operations and list endpoints
 *
 * @example
 * ```typescript
 * // In service layer for list endpoint
 * const prescriptions = await this.prescriptionModel.findAll({
 *   where: { studentId },
 *   limit: 20
 * });
 * const summaries = prescriptions.map(mapPrescriptionToSummaryDto);
 * return summaries;
 * ```
 *
 * @since 1.0.0
 */
export function mapPrescriptionToSummaryDto(prescription: any): PrescriptionSummaryDto {
  return {
    id: prescription.id,
    studentId: prescription.studentId,
    drugName: prescription.drugName,
    drugCode: prescription.drugCode,
    dosage: prescription.dosage,
    frequency: prescription.frequency,
    route: prescription.route,
    status: prescription.status,
    startDate: prescription.startDate,
    endDate: prescription.endDate,
    remainingRefills: prescription.getRemainingRefills(),
    isActive: prescription.isActive(),
    createdAt: prescription.createdAt,
  };
}

/**
 * Map VitalSigns model to VitalSignsResponseDto
 *
 * Converts a Sequelize VitalSigns model instance to a response DTO.
 * Includes all biometric measurements and abnormality flags.
 *
 * @param {VitalSigns} vitalSigns - Sequelize VitalSigns model instance
 * @returns {VitalSignsResponseDto} Mapped response DTO
 *
 * @remarks
 * - All measurement fields are optional to support partial vital sign recordings
 * - BMI is automatically calculated by model hooks when height/weight present
 * - Abnormal flags are system-generated based on clinical thresholds
 * - Preserves unit information for proper interpretation
 *
 * @example
 * ```typescript
 * const vitals = await this.vitalSignsModel.findByPk(id);
 * const dto = mapVitalSignsToResponseDto(vitals);
 * return dto;
 * ```
 *
 * @since 1.0.0
 */
export function mapVitalSignsToResponseDto(vitalSigns: any): VitalSignsResponseDto {
  return {
    id: vitalSigns.id,
    studentId: vitalSigns.studentId,
    measurementDate: vitalSigns.measurementDate,
    temperature: vitalSigns.temperature,
    temperatureUnit: vitalSigns.temperatureUnit,
    heartRate: vitalSigns.heartRate,
    respiratoryRate: vitalSigns.respiratoryRate,
    bloodPressureSystolic: vitalSigns.bloodPressureSystolic,
    bloodPressureDiastolic: vitalSigns.bloodPressureDiastolic,
    oxygenSaturation: vitalSigns.oxygenSaturation,
    weight: vitalSigns.weight,
    weightUnit: vitalSigns.weightUnit,
    height: vitalSigns.height,
    heightUnit: vitalSigns.heightUnit,
    bmi: vitalSigns.bmi,
    pain: vitalSigns.pain,
    isAbnormal: vitalSigns.isAbnormal,
    abnormalFlags: vitalSigns.abnormalFlags,
    measuredBy: vitalSigns.measuredBy,
    notes: vitalSigns.notes,
    createdAt: vitalSigns.createdAt,
    updatedAt: vitalSigns.updatedAt,
  };
}

/**
 * Map ClinicalNote model to ClinicalNoteResponseDto
 *
 * Converts a Sequelize ClinicalNote model instance to a response DTO.
 * Includes all note content, SOAP components, and signature tracking.
 *
 * @param {ClinicalNote} clinicalNote - Sequelize ClinicalNote model instance
 * @returns {ClinicalNoteResponseDto} Mapped response DTO
 *
 * @remarks
 * - SOAP components (subjective, objective, assessment, plan) are optional
 * - Only populated for NoteType.SOAP notes
 * - Signature fields track digital signature workflow
 * - Amendment tracking maintains audit trail for compliance
 * - Tags enable flexible categorization and filtering
 *
 * @example
 * ```typescript
 * const note = await this.clinicalNoteModel.findByPk(id, {
 *   include: ['author', 'student']
 * });
 * const dto = mapClinicalNoteToResponseDto(note);
 * return dto;
 * ```
 *
 * @since 1.0.0
 */
export function mapClinicalNoteToResponseDto(clinicalNote: any): ClinicalNoteResponseDto {
  return {
    id: clinicalNote.id,
    studentId: clinicalNote.studentId,
    visitId: clinicalNote.visitId,
    type: clinicalNote.type,
    createdBy: clinicalNote.createdBy,
    title: clinicalNote.title,
    content: clinicalNote.content,
    subjective: clinicalNote.subjective,
    objective: clinicalNote.objective,
    assessment: clinicalNote.assessment,
    plan: clinicalNote.plan,
    tags: clinicalNote.tags,
    isConfidential: clinicalNote.isConfidential,
    isSigned: clinicalNote.isSigned,
    signedAt: clinicalNote.signedAt,
    amended: clinicalNote.amended,
    amendmentReason: clinicalNote.amendmentReason,
    createdAt: clinicalNote.createdAt,
    updatedAt: clinicalNote.updatedAt,
  };
}

/**
 * Map array of Prescriptions to paginated list response
 *
 * Creates a standardized paginated response for prescription list endpoints.
 * Uses PrescriptionSummaryDto for optimized list performance.
 *
 * @param {Prescription[]} prescriptions - Array of Prescription model instances
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} total - Total count of prescriptions matching query
 * @returns {PrescriptionListResponseDto} Paginated response with summaries and metadata
 *
 * @remarks
 * - Automatically calculates pagination metadata (pages, hasNext, hasPrev, etc.)
 * - Maps each prescription to lightweight summary format
 * - Compatible with PaginationQueryDto parameters
 * - Follows standardized API response format
 *
 * @example
 * ```typescript
 * // In service layer
 * const { rows, count } = await this.prescriptionModel.findAndCountAll({
 *   where: { studentId },
 *   offset: query.getOffset(),
 *   limit: query.getLimit()
 * });
 *
 * return mapPrescriptionsToListResponse(
 *   rows,
 *   query.page,
 *   query.limit,
 *   count
 * );
 * ```
 *
 * @since 1.0.0
 * @see {@link PaginatedResponseDto.create} for pagination logic
 */
export function mapPrescriptionsToListResponse(
  prescriptions: any[],
  page: number,
  limit: number,
  total: number,
): PrescriptionListResponseDto {
  const summaries = prescriptions.map(mapPrescriptionToSummaryDto);
  return PaginatedResponseDto.create({
    data: summaries,
    page,
    limit,
    total,
  });
}
