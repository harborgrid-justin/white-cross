/**
 * @fileoverview Service Contracts and Interfaces for SOA
 * @module services/domain/contracts/ServiceContracts
 * @category Domain Services
 * 
 * Defines service contracts independent of implementation details.
 * Enables loose coupling and multiple implementations (HTTP, GraphQL, Mock, etc.).
 * 
 * Key Features:
 * - Protocol-agnostic service interfaces
 * - Business-focused operations (not HTTP verbs)
 * - Healthcare domain-specific contracts
 * - Version management
 * 
 * @example
 * ```typescript
 * // Implement contract with HTTP adapter
 * class HttpStudentService implements IStudentService {
 *   async enrollStudent(enrollment: StudentEnrollment): Promise<Student> {
 *     // HTTP implementation
 *   }
 * }
 * 
 * // Implement contract with GraphQL adapter
 * class GraphQLStudentService implements IStudentService {
 *   async enrollStudent(enrollment: StudentEnrollment): Promise<Student> {
 *     // GraphQL implementation
 *   }
 * }
 * ```
 */

// ==========================================
// COMMON TYPES
// ==========================================

export interface ServiceVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface ServiceMetadata {
  name: string;
  version: ServiceVersion;
  description: string;
}

export interface QueryCriteria {
  filters?: Record<string, unknown>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sorting?: {
    field: string;
    direction: 'ASC' | 'DESC';
  }[];
}

export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface CollectionResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==========================================
// STUDENT SERVICE CONTRACT
// ==========================================

export interface StudentEnrollment {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  additionalInfo?: Record<string, unknown>;
}

export interface StudentTransfer {
  studentId: string;
  fromSchoolId: string;
  toSchoolId: string;
  effectiveDate: Date;
  reason: string;
}

export interface StudentProfile {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  grade: string;
  schoolId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'WITHDRAWN';
}

/**
 * Student Service Contract
 * Business operations for student management
 */
export interface IStudentService {
  /**
   * Enroll a new student
   */
  enrollStudent(enrollment: StudentEnrollment): Promise<StudentProfile>;

  /**
   * Transfer student to another school
   */
  transferStudent(transfer: StudentTransfer): Promise<StudentProfile>;

  /**
   * Withdraw student from school
   */
  withdrawStudent(studentId: string, reason: string): Promise<void>;

  /**
   * Get student profile
   */
  getStudentProfile(studentId: string): Promise<StudentProfile>;

  /**
   * Search students
   */
  searchStudents(criteria: QueryCriteria): Promise<CollectionResponse<StudentProfile>>;

  /**
   * Update student information
   */
  updateStudentInfo(studentId: string, updates: Partial<StudentProfile>): Promise<StudentProfile>;
}

// ==========================================
// HEALTH SERVICE CONTRACT
// ==========================================

export interface HealthProfile {
  studentId: string;
  bloodType?: string;
  allergies: Allergy[];
  conditions: MedicalCondition[];
  vaccinations: Vaccination[];
  medications: Medication[];
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction: string;
  diagnosedDate: Date;
}

export interface MedicalCondition {
  id: string;
  condition: string;
  diagnosedDate: Date;
  status: 'ACTIVE' | 'RESOLVED' | 'MANAGED';
  notes?: string;
}

export interface Vaccination {
  id: string;
  vaccineType: string;
  administeredDate: Date;
  nextDueDate?: Date;
  administrator: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
}

/**
 * Health Service Contract
 * Business operations for health records
 */
export interface IHealthService {
  /**
   * Initialize health record for student
   */
  initializeHealthRecord(studentId: string): Promise<HealthProfile>;

  /**
   * Get student health profile
   */
  getHealthProfile(studentId: string): Promise<HealthProfile>;

  /**
   * Add allergy to health record
   */
  addAllergy(studentId: string, allergy: Omit<Allergy, 'id'>): Promise<Allergy>;

  /**
   * Add medical condition
   */
  addCondition(studentId: string, condition: Omit<MedicalCondition, 'id'>): Promise<MedicalCondition>;

  /**
   * Record vaccination
   */
  recordVaccination(studentId: string, vaccination: Omit<Vaccination, 'id'>): Promise<Vaccination>;

  /**
   * Check for allergies or contraindications
   */
  checkAllergies(studentId: string, substance: string): Promise<boolean>;
}

// ==========================================
// MEDICATION SERVICE CONTRACT
// ==========================================

export interface MedicationPrescription {
  studentId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy: string;
  notes?: string;
}

export interface MedicationAdministration {
  prescriptionId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: Date;
  dosage: string;
  notes?: string;
}

export interface AdministrationRecord {
  id: string;
  prescriptionId: string;
  studentId: string;
  administeredBy: string;
  administeredAt: Date;
  dosage: string;
  status: 'COMPLETED' | 'MISSED' | 'REFUSED';
}

/**
 * Medication Service Contract
 * Business operations for medication management
 */
export interface IMedicationService {
  /**
   * Prescribe medication to student
   */
  prescribeMedication(prescription: MedicationPrescription): Promise<Medication>;

  /**
   * Administer medication
   */
  administerMedication(administration: MedicationAdministration): Promise<AdministrationRecord>;

  /**
   * Discontinue medication
   */
  discontinueMedication(medicationId: string, reason: string): Promise<void>;

  /**
   * Get medication schedule for student
   */
  getMedicationSchedule(studentId: string, date: Date): Promise<Medication[]>;

  /**
   * Get administration history
   */
  getAdministrationHistory(studentId: string, startDate: Date, endDate: Date): Promise<AdministrationRecord[]>;
}

// ==========================================
// NOTIFICATION SERVICE CONTRACT
// ==========================================

export interface NotificationRequest {
  recipientId: string;
  type: string;
  subject: string;
  message: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  metadata?: Record<string, unknown>;
}

export interface NotificationRecord {
  id: string;
  recipientId: string;
  type: string;
  subject: string;
  sentAt: Date;
  deliveredAt?: Date;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
}

/**
 * Notification Service Contract
 * Business operations for notifications
 */
export interface INotificationService {
  /**
   * Send notification to recipient
   */
  sendNotification(request: NotificationRequest): Promise<NotificationRecord>;

  /**
   * Send emergency notification
   */
  sendEmergencyNotification(studentId: string, message: string): Promise<NotificationRecord[]>;

  /**
   * Get notification history
   */
  getNotificationHistory(recipientId: string, startDate: Date, endDate: Date): Promise<NotificationRecord[]>;
}

// ==========================================
// APPOINTMENT SERVICE CONTRACT
// ==========================================

export interface AppointmentRequest {
  studentId: string;
  appointmentType: string;
  scheduledFor: Date;
  duration: number;
  notes?: string;
}

export interface AppointmentRecord {
  id: string;
  studentId: string;
  appointmentType: string;
  scheduledFor: Date;
  duration: number;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
}

/**
 * Appointment Service Contract
 * Business operations for appointments
 */
export interface IAppointmentService {
  /**
   * Schedule appointment
   */
  scheduleAppointment(request: AppointmentRequest): Promise<AppointmentRecord>;

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string, reason: string): Promise<void>;

  /**
   * Complete appointment
   */
  completeAppointment(appointmentId: string, notes: string): Promise<AppointmentRecord>;

  /**
   * Get appointments for student
   */
  getAppointments(studentId: string, startDate: Date, endDate: Date): Promise<AppointmentRecord[]>;

  /**
   * Get available time slots
   */
  getAvailableSlots(date: Date): Promise<Date[]>;
}

// ==========================================
// AUDIT SERVICE CONTRACT
// ==========================================

export interface AuditEntry {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface AuditRecord {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Audit Service Contract
 * Business operations for audit logging (HIPAA compliance)
 */
export interface IAuditService {
  /**
   * Log audit entry
   */
  logAudit(entry: AuditEntry): Promise<AuditRecord>;

  /**
   * Get audit trail for resource
   */
  getAuditTrail(resourceType: string, resourceId: string): Promise<AuditRecord[]>;

  /**
   * Get user activity
   */
  getUserActivity(userId: string, startDate: Date, endDate: Date): Promise<AuditRecord[]>;

  /**
   * Search audit logs
   */
  searchAuditLogs(criteria: QueryCriteria): Promise<CollectionResponse<AuditRecord>>;
}

// ==========================================
// DATA SERVICE INTERFACE (Generic)
// ==========================================

/**
 * Generic Data Service Contract
 * Abstract data access operations
 */
export interface IDataService {
  /**
   * Fetch data by query
   */
  fetch<T>(query: QueryCriteria): Promise<T>;

  /**
   * Save entity
   */
  save<T>(entity: T): Promise<T>;

  /**
   * Update entity
   */
  update<T>(id: string, updates: Partial<T>): Promise<T>;

  /**
   * Delete entity
   */
  delete(id: string): Promise<void>;

  /**
   * Check health
   */
  healthCheck(): Promise<boolean>;
}
