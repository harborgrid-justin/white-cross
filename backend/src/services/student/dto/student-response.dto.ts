import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { Student } from '../../../database/models/student.model';

/**
 * Gender enumeration for student records
 * Matches Gender enum from Student model
 */
export enum GenderDto {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

/**
 * User Summary DTO
 * Lightweight representation of nurse (User) for student associations
 * Used when nurse details are included in student response
 */
export class UserSummaryDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Jane',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Smith',
  })
  lastName: string;

  @ApiProperty({
    description: 'User email address',
    example: 'jane.smith@school.edu',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'User role in the system',
    example: 'nurse',
    enum: ['nurse', 'admin', 'staff', 'principal', 'teacher'],
  })
  role: string;
}

/**
 * District Summary DTO
 * Lightweight representation of district for student associations
 * Used when district details are included in student response
 */
export class DistrictSummaryDto {
  @ApiProperty({
    description: 'District unique identifier',
    example: '660e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'District name',
    example: 'Springfield Unified School District',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'District code or identifier',
    example: 'SUSD-001',
    nullable: true,
  })
  code?: string | null;
}

/**
 * School Summary DTO
 * Lightweight representation of school for student associations
 * Used when school details are included in student response
 */
export class SchoolSummaryDto {
  @ApiProperty({
    description: 'School unique identifier',
    example: '770e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'School name',
    example: 'Lincoln Elementary School',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'District ID the school belongs to',
    example: '660e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  districtId?: string | null;

  @ApiPropertyOptional({
    description: 'School address',
    example: '123 Main St, Springfield, IL 62701',
    nullable: true,
  })
  address?: string | null;
}

/**
 * Health Record Summary DTO
 * Lightweight representation for student health records association
 */
export class HealthRecordSummaryDto {
  @ApiProperty({
    description: 'Health record unique identifier',
    example: '880e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Type of health record',
    example: 'CHECKUP',
    enum: ['CHECKUP', 'ILLNESS', 'INJURY', 'MEDICATION', 'IMMUNIZATION', 'SCREENING', 'OTHER'],
  })
  recordType: string;

  @ApiProperty({
    description: 'Date of the health record',
    example: '2024-11-14',
    format: 'date',
  })
  recordDate: Date;

  @ApiPropertyOptional({
    description: 'Chief complaint or reason for visit',
    example: 'Routine physical examination',
    nullable: true,
  })
  chiefComplaint?: string | null;
}

/**
 * Appointment Summary DTO
 * Lightweight representation for student appointments association
 */
export class AppointmentSummaryDto {
  @ApiProperty({
    description: 'Appointment unique identifier',
    example: '990e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Appointment date and time',
    example: '2024-11-20T10:00:00.000Z',
    format: 'date-time',
  })
  appointmentDate: Date;

  @ApiProperty({
    description: 'Appointment type',
    example: 'CHECKUP',
    enum: ['CHECKUP', 'FOLLOWUP', 'SCREENING', 'VACCINATION', 'EMERGENCY', 'OTHER'],
  })
  appointmentType: string;

  @ApiProperty({
    description: 'Appointment status',
    example: 'SCHEDULED',
    enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
  })
  status: string;
}

/**
 * Allergy Summary DTO
 * Lightweight representation for student allergies association
 */
export class AllergySummaryDto {
  @ApiProperty({
    description: 'Allergy unique identifier',
    example: 'aa0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Allergen name',
    example: 'Peanuts',
  })
  allergen: string;

  @ApiProperty({
    description: 'Severity level',
    example: 'SEVERE',
    enum: ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'],
  })
  severity: string;

  @ApiPropertyOptional({
    description: 'Reaction description',
    example: 'Anaphylaxis, difficulty breathing',
    nullable: true,
  })
  reaction?: string | null;
}

/**
 * Chronic Condition Summary DTO
 * Lightweight representation for student chronic conditions association
 */
export class ChronicConditionSummaryDto {
  @ApiProperty({
    description: 'Chronic condition unique identifier',
    example: 'bb0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Condition name',
    example: 'Asthma',
  })
  conditionName: string;

  @ApiPropertyOptional({
    description: 'ICD-10 diagnosis code',
    example: 'J45.909',
    nullable: true,
  })
  icd10Code?: string | null;

  @ApiProperty({
    description: 'Date diagnosed',
    example: '2020-03-15',
    format: 'date',
  })
  diagnosedDate: Date;
}

/**
 * Vaccination Summary DTO
 * Lightweight representation for student vaccinations association
 */
export class VaccinationSummaryDto {
  @ApiProperty({
    description: 'Vaccination unique identifier',
    example: 'cc0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Vaccine name',
    example: 'MMR (Measles, Mumps, Rubella)',
  })
  vaccineName: string;

  @ApiProperty({
    description: 'Date administered',
    example: '2024-09-15',
    format: 'date',
  })
  administeredDate: Date;

  @ApiPropertyOptional({
    description: 'Dose number (e.g., 1st dose, 2nd dose)',
    example: 1,
    nullable: true,
  })
  doseNumber?: number | null;
}

/**
 * Prescription Summary DTO
 * Lightweight representation for student prescriptions association
 */
export class PrescriptionSummaryDto {
  @ApiProperty({
    description: 'Prescription unique identifier',
    example: 'dd0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Medication name',
    example: 'Albuterol Inhaler',
  })
  medicationName: string;

  @ApiProperty({
    description: 'Dosage instructions',
    example: '2 puffs every 4-6 hours as needed',
  })
  dosage: string;

  @ApiProperty({
    description: 'Prescription start date',
    example: '2024-01-15',
    format: 'date',
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Prescription end date',
    example: '2025-01-15',
    format: 'date',
    nullable: true,
  })
  endDate?: Date | null;
}

/**
 * Clinic Visit Summary DTO
 * Lightweight representation for student clinic visits association
 */
export class ClinicVisitSummaryDto {
  @ApiProperty({
    description: 'Clinic visit unique identifier',
    example: 'ee0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Visit date and time',
    example: '2024-11-14T09:30:00.000Z',
    format: 'date-time',
  })
  visitDate: Date;

  @ApiPropertyOptional({
    description: 'Reason for visit',
    example: 'Headache and nausea',
    nullable: true,
  })
  reasonForVisit?: string | null;

  @ApiPropertyOptional({
    description: 'Visit outcome',
    example: 'Sent home with parent',
    nullable: true,
  })
  outcome?: string | null;
}

/**
 * Vital Signs Summary DTO
 * Lightweight representation for student vital signs association
 */
export class VitalSignsSummaryDto {
  @ApiProperty({
    description: 'Vital signs record unique identifier',
    example: 'ff0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Date vital signs were recorded',
    example: '2024-11-14T09:30:00.000Z',
    format: 'date-time',
  })
  recordedAt: Date;

  @ApiPropertyOptional({
    description: 'Temperature in Fahrenheit',
    example: 98.6,
    nullable: true,
  })
  temperature?: number | null;

  @ApiPropertyOptional({
    description: 'Blood pressure (systolic/diastolic)',
    example: '120/80',
    nullable: true,
  })
  bloodPressure?: string | null;

  @ApiPropertyOptional({
    description: 'Heart rate (beats per minute)',
    example: 72,
    nullable: true,
  })
  heartRate?: number | null;
}

/**
 * Clinical Note Summary DTO
 * Lightweight representation for student clinical notes association
 */
export class ClinicalNoteSummaryDto {
  @ApiProperty({
    description: 'Clinical note unique identifier',
    example: '110e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Note type',
    example: 'PROGRESS_NOTE',
    enum: ['PROGRESS_NOTE', 'ASSESSMENT', 'TREATMENT_PLAN', 'CONSULTATION', 'OTHER'],
  })
  noteType: string;

  @ApiProperty({
    description: 'Date note was created',
    example: '2024-11-14T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Note summary or title',
    example: 'Follow-up after clinic visit',
    nullable: true,
  })
  summary?: string | null;
}

/**
 * Incident Report Summary DTO
 * Lightweight representation for student incident reports association
 */
export class IncidentReportSummaryDto {
  @ApiProperty({
    description: 'Incident report unique identifier',
    example: '220e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Incident date and time',
    example: '2024-11-14T11:00:00.000Z',
    format: 'date-time',
  })
  incidentDate: Date;

  @ApiProperty({
    description: 'Incident type',
    example: 'INJURY',
    enum: ['INJURY', 'ILLNESS', 'BEHAVIORAL', 'SAFETY', 'OTHER'],
  })
  incidentType: string;

  @ApiPropertyOptional({
    description: 'Brief description of incident',
    example: 'Student fell on playground',
    nullable: true,
  })
  description?: string | null;
}

/**
 * Academic Transcript Summary DTO
 * Lightweight representation for student academic transcripts association
 */
export class AcademicTranscriptSummaryDto {
  @ApiProperty({
    description: 'Academic transcript unique identifier',
    example: '330e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Academic year',
    example: '2024-2025',
  })
  academicYear: string;

  @ApiProperty({
    description: 'Grade level for this transcript',
    example: '5',
  })
  grade: string;

  @ApiPropertyOptional({
    description: 'GPA (Grade Point Average)',
    example: 3.5,
    nullable: true,
  })
  gpa?: number | null;
}

/**
 * Mental Health Record Summary DTO
 * Lightweight representation for student mental health records association
 */
export class MentalHealthRecordSummaryDto {
  @ApiProperty({
    description: 'Mental health record unique identifier',
    example: '440e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Assessment date',
    example: '2024-10-15',
    format: 'date',
  })
  assessmentDate: Date;

  @ApiPropertyOptional({
    description: 'Assessment type',
    example: 'SCREENING',
    enum: ['SCREENING', 'ASSESSMENT', 'COUNSELING', 'INTERVENTION', 'OTHER'],
    nullable: true,
  })
  assessmentType?: string | null;

  @ApiPropertyOptional({
    description: 'Risk level',
    example: 'LOW',
    enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
    nullable: true,
  })
  riskLevel?: string | null;
}

/**
 * Student Summary DTO
 * Lightweight representation of student for associations
 * Used when referencing students from other domain entities
 */
export class StudentSummaryDto {
  @ApiProperty({
    description: 'Student unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'School-assigned student number (unique identifier)',
    example: 'STU-2024-001',
  })
  studentNumber: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Student full name (computed field)',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Current grade level',
    example: '5',
  })
  grade: string;

  @ApiProperty({
    description: 'Student date of birth',
    example: '2010-05-15',
    format: 'date',
  })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Student age in years (computed field)',
    example: 14,
    minimum: 3,
    maximum: 22,
  })
  age: number;

  @ApiProperty({
    description: 'Whether student is currently active/enrolled',
    example: true,
  })
  isActive: boolean;
}

/**
 * Student Response DTO
 * Complete student record with all fields and optional associations
 * Used for GET /students/:id and POST/PUT responses
 *
 * @remarks
 * - Virtual fields (fullName, age) are computed from base fields
 * - Association fields are optional and included based on query parameters
 * - PHI (Protected Health Information) fields marked in model are included
 * - Supports soft deletes (deletedAt field)
 */
export class StudentResponseDto {
  // Base Fields

  @ApiProperty({
    description: 'Student unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'School-assigned student number (unique identifier). PHI - Protected Health Information.',
    example: 'STU-2024-001',
    maxLength: 50,
  })
  studentNumber: string;

  @ApiProperty({
    description: 'Student first name. PHI - Protected Health Information.',
    example: 'John',
    maxLength: 100,
  })
  firstName: string;

  @ApiProperty({
    description: 'Student last name. PHI - Protected Health Information.',
    example: 'Doe',
    maxLength: 100,
  })
  lastName: string;

  @ApiProperty({
    description: 'Student date of birth. PHI - Protected Health Information. Must be between 3 and 22 years old.',
    example: '2010-05-15',
    format: 'date',
  })
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Current grade level (e.g., K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)',
    example: '5',
    maxLength: 10,
  })
  grade: string;

  @ApiProperty({
    description: 'Student gender',
    example: 'MALE',
    enum: GenderDto,
    enumName: 'GenderDto',
  })
  gender: GenderDto;

  @ApiPropertyOptional({
    description: 'Profile photo URL (must point to encrypted storage). PHI - Protected Health Information.',
    example: 'https://cdn.whitecross.health/photos/student-550e8400.jpg',
    maxLength: 500,
    nullable: true,
  })
  photo?: string | null;

  @ApiPropertyOptional({
    description: 'Medical record number (unique identifier for healthcare). PHI - Protected Health Information. Format: 6-12 alphanumeric characters, optionally separated by hyphen.',
    example: 'MRN-12345678',
    pattern: '^[A-Z0-9]{2,4}-?[A-Z0-9]{4,8}$',
    minLength: 6,
    maxLength: 50,
    nullable: true,
  })
  medicalRecordNum?: string | null;

  @ApiProperty({
    description: 'Active enrollment status. Indicates if student is currently enrolled.',
    example: true,
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'School enrollment date',
    example: '2024-09-01',
    format: 'date-time',
  })
  enrollmentDate: Date;

  // Foreign Keys

  @ApiPropertyOptional({
    description: 'Assigned nurse ID (foreign key to users table)',
    example: '660e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  nurseId?: string | null;

  @ApiPropertyOptional({
    description: 'School ID (foreign key to schools table)',
    example: '770e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  schoolId?: string | null;

  @ApiPropertyOptional({
    description: 'District ID (foreign key to districts table)',
    example: '880e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  districtId?: string | null;

  @ApiPropertyOptional({
    description: 'User ID who created this record',
    example: '990e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  createdBy?: string | null;

  @ApiPropertyOptional({
    description: 'User ID who last updated this record',
    example: 'aa0e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    nullable: true,
  })
  updatedBy?: string | null;

  // Virtual/Computed Fields

  @ApiProperty({
    description: 'Student full name (computed field: firstName + lastName)',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Student age in years (computed from dateOfBirth)',
    example: 14,
    minimum: 3,
    maximum: 22,
  })
  age: number;

  // BelongsTo Associations (Optional - included when requested)

  @ApiPropertyOptional({
    description: 'Assigned nurse details (included when ?include=nurse is specified)',
    type: () => UserSummaryDto,
    nullable: true,
  })
  @Type(() => UserSummaryDto)
  nurse?: UserSummaryDto | null;

  @ApiPropertyOptional({
    description: 'School details (included when ?include=school is specified)',
    type: () => SchoolSummaryDto,
    nullable: true,
  })
  @Type(() => SchoolSummaryDto)
  school?: SchoolSummaryDto | null;

  @ApiPropertyOptional({
    description: 'District details (included when ?include=district is specified)',
    type: () => DistrictSummaryDto,
    nullable: true,
  })
  @Type(() => DistrictSummaryDto)
  district?: DistrictSummaryDto | null;

  // HasMany Associations (Optional - included when requested)

  @ApiPropertyOptional({
    description: 'Health records (included when ?include=healthRecords is specified)',
    type: [HealthRecordSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => HealthRecordSummaryDto)
  healthRecords?: HealthRecordSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Academic transcripts (included when ?include=academicTranscripts is specified)',
    type: [AcademicTranscriptSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => AcademicTranscriptSummaryDto)
  academicTranscripts?: AcademicTranscriptSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Mental health records (included when ?include=mentalHealthRecords is specified)',
    type: [MentalHealthRecordSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => MentalHealthRecordSummaryDto)
  mentalHealthRecords?: MentalHealthRecordSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Appointments (included when ?include=appointments is specified)',
    type: [AppointmentSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => AppointmentSummaryDto)
  appointments?: AppointmentSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Prescriptions (included when ?include=prescriptions is specified)',
    type: [PrescriptionSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => PrescriptionSummaryDto)
  prescriptions?: PrescriptionSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Clinic visits (included when ?include=clinicVisits is specified)',
    type: [ClinicVisitSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => ClinicVisitSummaryDto)
  clinicVisits?: ClinicVisitSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Allergies (included when ?include=allergies is specified)',
    type: [AllergySummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => AllergySummaryDto)
  allergies?: AllergySummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Chronic conditions (included when ?include=chronicConditions is specified)',
    type: [ChronicConditionSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => ChronicConditionSummaryDto)
  chronicConditions?: ChronicConditionSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Vaccinations (included when ?include=vaccinations is specified)',
    type: [VaccinationSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => VaccinationSummaryDto)
  vaccinations?: VaccinationSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Vital signs records (included when ?include=vitalSigns is specified)',
    type: [VitalSignsSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => VitalSignsSummaryDto)
  vitalSigns?: VitalSignsSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Clinical notes (included when ?include=clinicalNotes is specified)',
    type: [ClinicalNoteSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => ClinicalNoteSummaryDto)
  clinicalNotes?: ClinicalNoteSummaryDto[] | null;

  @ApiPropertyOptional({
    description: 'Incident reports (included when ?include=incidentReports is specified)',
    type: [IncidentReportSummaryDto],
    isArray: true,
    nullable: true,
  })
  @Type(() => IncidentReportSummaryDto)
  incidentReports?: IncidentReportSummaryDto[] | null;

  // Timestamps

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-09-01T08:00:00.000Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-11-14T15:30:00.000Z',
    format: 'date-time',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Soft delete timestamp (null if not deleted). HIPAA compliance - audit trail for PHI.',
    example: null,
    format: 'date-time',
    nullable: true,
  })
  deletedAt?: Date | null;
}

/**
 * Student List Response DTO
 * Paginated list of students using standardized pagination format
 * Used for GET /students list endpoint
 *
 * @example
 * {
 *   "data": [{ ...StudentResponseDto }, { ...StudentResponseDto }],
 *   "meta": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "pages": 8,
 *     "hasNext": true,
 *     "hasPrev": false,
 *     "nextPage": 2,
 *     "prevPage": null
 *   }
 * }
 */
export class StudentListResponseDto extends PaginatedResponseDto<StudentResponseDto> {
  @ApiProperty({
    description: 'Array of students for the current page',
    type: [StudentResponseDto],
    isArray: true,
  })
  @Type(() => StudentResponseDto)
  data: StudentResponseDto[];
}

/**
 * Map Sequelize Student model to StudentResponseDto
 * Transforms raw Sequelize model instance to clean DTO with all fields
 * Handles virtual fields, associations, and proper type conversion
 *
 * @param student - Sequelize Student model instance
 * @returns StudentResponseDto with all fields properly mapped
 *
 * @example
 * ```typescript
 * const student = await Student.findByPk(id, {
 *   include: ['nurse', 'school', 'allergies']
 * });
 * const dto = mapStudentToResponseDto(student);
 * return dto;
 * ```
 */
export function mapStudentToResponseDto(student: Student): StudentResponseDto {
  return {
    // Base fields
    id: student.id,
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth,
    grade: student.grade,
    gender: student.gender as GenderDto,
    photo: student.photo ?? null,
    medicalRecordNum: student.medicalRecordNum ?? null,
    isActive: student.isActive,
    enrollmentDate: student.enrollmentDate,

    // Foreign keys
    nurseId: student.nurseId ?? null,
    schoolId: student.schoolId ?? null,
    districtId: student.districtId ?? null,
    createdBy: student.createdBy ?? null,
    updatedBy: student.updatedBy ?? null,

    // Virtual/computed fields
    fullName: student.fullName,
    age: student.age,

    // BelongsTo associations (if loaded)
    nurse: student.nurse
      ? {
          id: student.nurse.id,
          firstName: student.nurse.firstName,
          lastName: student.nurse.lastName,
          email: student.nurse.email,
          role: student.nurse.role,
        }
      : null,

    school: student.school
      ? {
          id: student.school.id,
          name: student.school.name,
          districtId: student.school.districtId,
          address: student.school.address,
        }
      : null,

    district: student.district
      ? {
          id: student.district.id,
          name: student.district.name,
          code: student.district.code,
        }
      : null,

    // HasMany associations (if loaded)
    healthRecords: student.healthRecords
      ? student.healthRecords.map((record) => ({
          id: record.id,
          recordType: record.recordType,
          recordDate: record.recordDate,
          chiefComplaint: record.chiefComplaint ?? null,
        }))
      : null,

    academicTranscripts: student.academicTranscripts
      ? student.academicTranscripts.map((transcript) => ({
          id: transcript.id,
          academicYear: transcript.academicYear,
          grade: transcript.grade,
          gpa: transcript.gpa ?? null,
        }))
      : null,

    mentalHealthRecords: student.mentalHealthRecords
      ? student.mentalHealthRecords.map((record) => ({
          id: record.id,
          assessmentDate: record.assessmentDate,
          assessmentType: record.assessmentType ?? null,
          riskLevel: record.riskLevel ?? null,
        }))
      : null,

    appointments: student.appointments
      ? student.appointments.map((appointment) => ({
          id: appointment.id,
          appointmentDate: appointment.appointmentDate,
          appointmentType: appointment.appointmentType,
          status: appointment.status,
        }))
      : null,

    prescriptions: student.prescriptions
      ? student.prescriptions.map((prescription) => ({
          id: prescription.id,
          medicationName: prescription.medicationName,
          dosage: prescription.dosage,
          startDate: prescription.startDate,
          endDate: prescription.endDate ?? null,
        }))
      : null,

    clinicVisits: student.clinicVisits
      ? student.clinicVisits.map((visit) => ({
          id: visit.id,
          visitDate: visit.visitDate,
          reasonForVisit: visit.reasonForVisit ?? null,
          outcome: visit.outcome ?? null,
        }))
      : null,

    allergies: student.allergies
      ? student.allergies.map((allergy) => ({
          id: allergy.id,
          allergen: allergy.allergen,
          severity: allergy.severity,
          reaction: allergy.reaction ?? null,
        }))
      : null,

    chronicConditions: student.chronicConditions
      ? student.chronicConditions.map((condition) => ({
          id: condition.id,
          conditionName: condition.conditionName,
          icd10Code: condition.icd10Code ?? null,
          diagnosedDate: condition.diagnosedDate,
        }))
      : null,

    vaccinations: student.vaccinations
      ? student.vaccinations.map((vaccination) => ({
          id: vaccination.id,
          vaccineName: vaccination.vaccineName,
          administeredDate: vaccination.administeredDate,
          doseNumber: vaccination.doseNumber ?? null,
        }))
      : null,

    vitalSigns: student.vitalSigns
      ? student.vitalSigns.map((vitals) => ({
          id: vitals.id,
          recordedAt: vitals.recordedAt,
          temperature: vitals.temperature ?? null,
          bloodPressure: vitals.bloodPressure ?? null,
          heartRate: vitals.heartRate ?? null,
        }))
      : null,

    clinicalNotes: student.clinicalNotes
      ? student.clinicalNotes.map((note) => ({
          id: note.id,
          noteType: note.noteType,
          createdAt: note.createdAt,
          summary: note.summary ?? null,
        }))
      : null,

    incidentReports: student.incidentReports
      ? student.incidentReports.map((report) => ({
          id: report.id,
          incidentDate: report.incidentDate,
          incidentType: report.incidentType,
          description: report.description ?? null,
        }))
      : null,

    // Timestamps
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
    deletedAt: student.deletedAt ?? null,
  };
}

/**
 * Map Sequelize Student model to StudentSummaryDto
 * Lightweight transformation for association references
 *
 * @param student - Sequelize Student model instance
 * @returns StudentSummaryDto with essential fields
 *
 * @example
 * ```typescript
 * const students = await Student.findAll();
 * const summaries = students.map(mapStudentToSummaryDto);
 * ```
 */
export function mapStudentToSummaryDto(student: Student): StudentSummaryDto {
  return {
    id: student.id,
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    fullName: student.fullName,
    grade: student.grade,
    dateOfBirth: student.dateOfBirth,
    age: student.age,
    isActive: student.isActive,
  };
}
