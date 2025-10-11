// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
}

// User Types - Aligned with main types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'NURSE' | 'SCHOOL_ADMIN' | 'DISTRICT_ADMIN' | 'READ_ONLY' | 'COUNSELOR';
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Student Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  grade: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone?: string;
  email?: string;
  emergencyContacts: EmergencyContact[];
  medicalInfo?: {
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    lastPhysical?: string;
    physicianName?: string;
    physicianPhone?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  priority: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
}

// Health Record Types
export interface HealthRecord {
  id: string;
  studentId: string;
  type: string;
  date: string;
  description: string;
  vital?: VitalSigns;
  provider?: string;
  notes?: string;
  attachments?: string[];
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  temperature?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  height?: number;
  weight?: number;
  bmi?: number;
}

export interface Allergy {
  id: string;
  studentId: string;
  allergen: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  reaction?: string;
  treatment?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChronicCondition {
  id: string;
  studentId: string;
  condition: string;
  diagnosedDate: string;
  status: string;
  severity?: string;
  notes?: string;
  carePlan?: string;
  medications?: string[];
  restrictions?: string[];
  triggers?: string[];
  diagnosedBy?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Medication Types
export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: string;
  manufacturer?: string;
  ndcNumber?: string;
  lotNumber?: string;
  expirationDate: string;
  instructions: string;
  sideEffects?: string[];
  contraindications?: string[];
  isControlled: boolean;
  storageRequirements?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  nurseId: string;
  scheduledTime: string;
  administeredTime?: string;
  dosageGiven: string;
  status: 'SCHEDULED' | 'ADMINISTERED' | 'MISSED' | 'REFUSED' | 'CANCELLED';
  notes?: string;
  sideEffectsObserved?: string[];
  createdAt: string;
  updatedAt: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: string;
  duration: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason: string;
  notes?: string;
  outcomes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  student: Student;
  nurse: User;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilters extends PaginationParams {
  nurseId?: string;
  studentId?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AppointmentCreateData {
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: string;
  reason: string;
  duration?: number;
  notes?: string;
}

export interface AppointmentUpdateData {
  type?: string;
  scheduledAt?: string;
  reason?: string;
  duration?: number;
  notes?: string;
  status?: string;
  outcomes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export interface AppointmentStatistics {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  noShowRate: number;
  completionRate: number;
  totalAppointments?: number;
  scheduledCount?: number;
  completedCount?: number;
  cancelledCount?: number;
  noShowCount?: number;
  averageDuration?: number;
  utilizationRate?: number;
  trendsData?: any[];
}

export interface NurseAvailability {
  id: string;
  nurseId: string;
  startTime: string;
  endTime: string;
  dayOfWeek?: number;
  isRecurring: boolean;
  specificDate?: string;
  isAvailable: boolean;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NurseAvailabilityData {
  nurseId: string;
  startTime: string;
  endTime: string;
  dayOfWeek?: number;
  isRecurring?: boolean;
  specificDate?: string;
  isAvailable?: boolean;
  reason?: string;
}

export interface AvailabilitySlot {
  start: Date;
  end: Date;
  available: boolean;
  conflictingAppointment?: {
    id: string;
    student: string;
    reason: string;
  };
}

export interface WaitlistEntry {
  id: string;
  studentId: string;
  nurseId?: string;
  type: string;
  reason: string;
  priority: string;
  preferredDate?: string;
  duration?: number;
  notes?: string;
  status: string;
  expiresAt?: string;
  notifiedAt?: string;
  addedAt?: string;
  student: Student;
  nurse?: User;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistFilters {
  nurseId?: string;
  status?: string;
  priority?: string;
}

export interface RecurringAppointmentData {
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: string;
  reason: string;
  duration?: number;
  recurrence: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate: string;
    daysOfWeek?: number[];
  };
}

// Document Types
export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  version: number;
  status: string;
  tags: string[];
  isTemplate: boolean;
  templateData?: any;
  parentId?: string;
  retentionDate?: string;
  accessLevel: string;
  uploadedBy: string;
  studentId?: string;
  signatures?: DocumentSignature[];
  versions?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSignature {
  id: string;
  documentId: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  signedAt: string;
  ipAddress?: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  sku?: string;
  barcode?: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitCost: number;
  totalValue: number;
  supplier?: string;
  location?: string;
  expirationDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Communication Types
export interface CommunicationTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: string;
  category: string;
  variables?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationMessage {
  id: string;
  subject?: string;
  content: string;
  priority: string;
  category: string;
  channels: string[];
  scheduledAt?: string;
  sentAt?: string;
  status: string;
  recipientCount: number;
  deliveredCount: number;
  failedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Report Types
export interface ReportData {
  id: string;
  type: string;
  title: string;
  data: any;
  filters?: any;
  generatedAt: string;
  generatedBy: string;
}

// Integration Types
export interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  configuration: any;
  lastSync?: string;
  syncFrequency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Compliance Types
export interface ComplianceItem {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  completedDate?: string;
  assignedTo?: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceReport {
  id: string;
  reportType: string;
  title: string;
  description?: string;
  status: string;
  period: string;
  findings?: any;
  recommendations?: any;
  dueDate?: string;
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  requirement: string;
  description?: string;
  category: string;
  status: string;
  evidence?: string;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsentForm {
  id: string;
  type: string;
  title: string;
  description: string;
  content: string;
  version: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  version: string;
  effectiveDate: string;
  reviewDate?: string;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Incident Report Types
export interface IncidentReport {
  id: string;
  studentId?: string;
  reportedBy: string;
  type: string;
  severity: string;
  location: string;
  description: string;
  immediateAction?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: string;
  witnesses?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WitnessStatement {
  id: string;
  incidentReportId: string;
  witnessName: string;
  witnessContact?: string;
  relationship?: string;
  statement: string;
  providedAt: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUpAction {
  id: string;
  incidentReportId: string;
  action: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  status: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Access Control Types - Re-exported from main types
// Import from main types to avoid duplication
export type {
  Role,
  Permission,
  RolePermission,
  UserRoleAssignment,
  Session,
  LoginAttempt,
  SecurityIncident,
  IpRestriction,
  SecurityIncidentType,
  IncidentSeverity,
  SecurityIncidentStatus,
  IpRestrictionType
} from '../../types/accessControl';

// Missing types that are being imported
export interface InventoryAlert {
  id: string;
  medicationId: string;
  alertType: 'LOW_STOCK' | 'EXPIRING' | 'EXPIRED' | 'OUT_OF_STOCK';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  description?: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  period: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  status: 'PENDING' | 'APPROVED' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  vendor: Vendor;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  medicationId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  notes?: string;
  medication: Medication;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: string;
  manufacturer?: string;
  ndcNumber?: string;
  lotNumber?: string;
  expirationDate: string;
  instructions: string;
  sideEffects?: string[];
  contraindications?: string[];
  isControlled: boolean;
  storageRequirements?: string;
  createdAt: string;
  updatedAt: string;
}


// Audit Types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// API Interface Types
export interface IAppointmentsApi {
  // Core CRUD Operations
  getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>>;
  getById(id: string): Promise<{ appointment: Appointment }>;
  create(appointmentData: AppointmentCreateData): Promise<{ appointment: Appointment }>;
  update(id: string, data: AppointmentUpdateData): Promise<{ appointment: Appointment }>;
  cancel(id: string, reason?: string): Promise<{ appointment: Appointment }>;
  markNoShow(id: string): Promise<{ appointment: Appointment }>;

  // Appointment Lifecycle
  start(id: string): Promise<{ appointment: Appointment }>;
  complete(id: string, data?: { notes?: string; outcomes?: string; followUpRequired?: boolean; followUpDate?: string }): Promise<{ appointment: Appointment }>;
  reschedule(id: string, newScheduledAt: string, reason?: string): Promise<{ appointment: Appointment }>;

  // Availability & Scheduling
  getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }>;
  checkConflicts(nurseId: string, startTime: string, duration: number, excludeAppointmentId?: string): Promise<any>;
  getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }>;

  // Statistics & Analytics
  getStatistics(filters?: { nurseId?: string; dateFrom?: string; dateTo?: string }): Promise<AppointmentStatistics>;
  getTrends(dateFrom: string, dateTo: string, groupBy?: 'day' | 'week' | 'month'): Promise<{ trends: any[] }>;
  getNoShowStats(nurseId?: string, dateFrom?: string, dateTo?: string): Promise<{ rate: number; total: number; noShows: number; byStudent: any[] }>;
  getUtilizationStats(nurseId: string, dateFrom: string, dateTo: string): Promise<{ utilizationRate: number; totalSlots: number; bookedSlots: number; availableSlots: number; byDay: any[] }>;

  // Recurring Appointments
  createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }>;

  // Nurse Availability Management
  setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }>;
  getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }>;
  updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }>;
  deleteAvailability(id: string): Promise<void>;

  // Waitlist Management
  addToWaitlist(data: { studentId: string; nurseId?: string; type: string; reason: string; priority?: string; preferredDate?: string; duration?: number; notes?: string }): Promise<{ entry: WaitlistEntry }>;
  getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: WaitlistEntry[] }>;
  removeFromWaitlist(id: string, reason?: string): Promise<{ entry: WaitlistEntry }>;
  updateWaitlistPriority(id: string, priority: string): Promise<{ entry: WaitlistEntry }>;
  getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }>;
  notifyWaitlistEntry(id: string, message?: string): Promise<{ entry: WaitlistEntry; notification: any }>;

  // Reminder Management
  processPendingReminders(): Promise<any>;
  getAppointmentReminders(appointmentId: string): Promise<{ reminders: any[] }>;
  scheduleReminder(data: { appointmentId: string; type: string; scheduleTime: string; message?: string }): Promise<{ reminder: any }>;
  cancelReminder(reminderId: string): Promise<{ reminder: any }>;

  // Bulk Operations
  cancelMultiple(appointmentIds: string[], reason?: string): Promise<{ cancelled: number; failed: number }>;
  getForStudents(studentIds: string[], filters?: Partial<AppointmentFilters>): Promise<{ appointments: Appointment[] }>;

  // Advanced Filtering & Search
  getByDateRange(dateFrom: string, dateTo: string, nurseId?: string): Promise<{ appointments: Appointment[] }>;
  search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>>;

  // Calendar Export
  exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob>;
}

export interface ICommunicationApi {
  // Template Operations
  getTemplates(filters?: any): Promise<{ templates: CommunicationTemplate[] }>;
  getTemplateById(id: string): Promise<{ template: CommunicationTemplate }>;
  createTemplate(data: any): Promise<{ template: CommunicationTemplate }>;
  updateTemplate(id: string, data: any): Promise<{ template: CommunicationTemplate }>;
  deleteTemplate(id: string): Promise<{ success: boolean }>;

  // Message Operations
  sendMessage(data: any): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }>;
  sendBroadcast(data: any): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }>;
  getMessages(filters?: any): Promise<{ messages: CommunicationMessage[]; pagination: any }>;
  getMessageById(id: string): Promise<{ message: CommunicationMessage }>;
  getMessageDeliveryStatus(messageId: string): Promise<{ deliveries: any[]; summary: any }>;

  // Emergency Alerts
  sendEmergencyAlert(data: any): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }>;

  // Scheduled Messages
  processScheduledMessages(): Promise<{ processedCount: number }>;

  // Statistics & Analytics
  getStatistics(filters?: any): Promise<any>;

  // Translation
  translateMessage(data: any): Promise<{ translated: string }>;

  // Communication Options
  getOptions(): Promise<any>;
}

// IAccessControlApi is now defined in the accessControlApi.ts file
// Re-export for convenience
export type { IAccessControlApi } from '../modules/accessControlApi';

export interface IComplianceApi {
  // Compliance Reports
  getReports(params?: any): Promise<{ reports: ComplianceReport[]; pagination?: any }>;
  getReportById(id: string): Promise<{ report: ComplianceReport }>;
  createReport(data: { reportType: string; title: string; description?: string; period: string; dueDate?: string }): Promise<{ report: ComplianceReport }>;
  updateReport(id: string, data: any): Promise<{ report: ComplianceReport }>;
  deleteReport(id: string): Promise<{ success: boolean }>;
  generateReport(reportType: string, period: string): Promise<{ report: ComplianceReport }>;

  // Checklist Items
  addChecklistItem(data: { requirement: string; description?: string; category: string; dueDate?: string; reportId?: string }): Promise<{ item: ChecklistItem }>;
  updateChecklistItem(id: string, data: any): Promise<{ item: ChecklistItem }>;

  // Consent Forms
  getConsentForms(filters?: any): Promise<{ forms: ConsentForm[] }>;
  createConsentForm(data: { type: string; title: string; description: string; content: string; version?: string; expiresAt?: string }): Promise<{ form: ConsentForm }>;
  signConsentForm(data: { consentFormId: string; studentId: string; signatureData?: string; signedBy: string; relationship: string }): Promise<{ signature: any }>;
  getStudentConsents(studentId: string): Promise<{ consents: any[] }>;
  withdrawConsent(signatureId: string): Promise<{ signature: any }>;

  // Policy Documents
  getPolicies(params?: any): Promise<{ policies: PolicyDocument[] }>;
  createPolicy(data: { title: string; category: string; content: string; version?: string; effectiveDate: string; reviewDate?: string }): Promise<{ policy: PolicyDocument }>;
  updatePolicy(id: string, data: any): Promise<{ policy: PolicyDocument }>;
  acknowledgePolicy(policyId: string): Promise<{ acknowledgment: any }>;

  // Statistics and Audit
  getStatistics(period?: string): Promise<any>;
  getAuditLogs(params?: any): Promise<{ logs: any[]; pagination?: any }>;
}

export interface IEmergencyContactsApi {
  /**
   * Get emergency contacts for a student
   */
  getByStudent(studentId: string): Promise<{ contacts: any[] }>;

  /**
   * Create a new emergency contact
   */
  create(data: {
    studentId: string;
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    priority: string;
  }): Promise<{ contact: any }>;

  /**
   * Update an emergency contact
   */
  update(id: string, data: {
    firstName?: string;
    lastName?: string;
    relationship?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    priority?: string;
    isActive?: boolean;
  }): Promise<{ contact: any }>;

  /**
   * Delete an emergency contact (soft delete)
   */
  delete(id: string): Promise<{ success: boolean }>;

  /**
   * Send emergency notification to all contacts for a student
   */
  notifyStudent(studentId: string, notification: {
    message: string;
    type: 'emergency' | 'health' | 'medication' | 'general';
    priority: 'low' | 'medium' | 'high' | 'critical';
    channels: ('sms' | 'email' | 'voice')[];
    attachments?: string[];
  }): Promise<{ results: any[] }>;

  /**
   * Send notification to specific contact
   */
  notifyContact(contactId: string, notification: {
    message: string;
    type: 'emergency' | 'health' | 'medication' | 'general';
    priority: 'low' | 'medium' | 'high' | 'critical';
    channels: ('sms' | 'email' | 'voice')[];
    attachments?: string[];
  }): Promise<{ result: any }>;

  /**
   * Verify emergency contact information
   */
  verify(contactId: string, method: 'sms' | 'email' | 'voice'): Promise<{
    verificationCode?: string;
    method: 'sms' | 'email' | 'voice';
    messageId?: string;
    callId?: string;
    success: boolean;
  }>;

  /**
   * Get emergency contacts statistics
   */
  getStatistics(): Promise<{
    totalContacts: number;
    studentsWithoutContacts: number;
    byPriority: Record<string, number>;
  }>;
}

export interface IIncidentReportsApi {
  getAll(params?: { page?: number; limit?: number; studentId?: string; type?: string; severity?: string; status?: string; dateFrom?: string; dateTo?: string }): Promise<{ reports: IncidentReport[]; pagination?: any }>;
  getById(id: string): Promise<{ report: IncidentReport }>;
  create(data: { studentId?: string; type: string; severity: string; location: string; description: string; immediateAction?: string; witnesses?: string[]; attachments?: string[] }): Promise<{ report: IncidentReport }>;
  update(id: string, data: Partial<IncidentReport>): Promise<{ report: IncidentReport }>;
  delete(id: string): Promise<{ success: boolean }>;
  addWitnessStatement(data: { incidentReportId: string; witnessName: string; witnessContact?: string; relationship?: string; statement: string; providedAt: string; recordedBy: string }): Promise<{ statement: WitnessStatement }>;
  updateWitnessStatement(id: string, data: Partial<WitnessStatement>): Promise<{ statement: WitnessStatement }>;
  deleteWitnessStatement(id: string): Promise<{ success: boolean }>;
  addFollowUpAction(data: { incidentReportId: string; action: string; description?: string; assignedTo?: string; dueDate?: string; createdBy: string }): Promise<{ action: FollowUpAction }>;
  updateFollowUpAction(id: string, data: Partial<FollowUpAction>): Promise<{ action: FollowUpAction }>;
  deleteFollowUpAction(id: string): Promise<{ success: boolean }>;
  completeFollowUpAction(id: string, notes?: string): Promise<{ action: FollowUpAction }>;
  getFollowUpActions(incidentReportId: string): Promise<{ actions: FollowUpAction[] }>;
  getWitnessStatements(incidentReportId: string): Promise<{ statements: WitnessStatement[] }>;
  generateReport(id: string): Promise<Blob>;
  exportReports(params?: any): Promise<Blob>;
  getStatistics(dateFrom?: string, dateTo?: string): Promise<any>;
  uploadEvidence(incidentReportId: string, files: File[]): Promise<{ attachments: string[] }>;
  deleteEvidence(incidentReportId: string, fileName: string): Promise<{ success: boolean }>;
  submitToInsurance(id: string, insuranceData: any): Promise<{ submission: any }>;
  getInsuranceSubmissions(incidentReportId: string): Promise<{ submissions: any[] }>;
}
