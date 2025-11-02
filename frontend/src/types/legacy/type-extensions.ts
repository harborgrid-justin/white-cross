/**
 * Type Extensions for Domain Models
 * Extends existing interfaces with additional properties used in the codebase
 */

// ============================================================================
// Administration Type Extensions
// ============================================================================

/**
 * Extended user update data with status field
 */
export interface ExtendedUserUpdateData {
  role?: 'ADMIN' | 'DISTRICT_ADMIN' | 'SCHOOL_ADMIN' | 'NURSE' | 'COUNSELOR' | 'VIEWER';
  email?: string;
  schoolId?: string;
  districtId?: string;
  firstName?: string;
  lastName?: string;
  status?: string; // User status field
}

/**
 * Extended audit log filters
 */
export interface ExtendedAuditLogFilters {
  page?: number;
  limit?: number;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  id?: string; // Individual audit log ID
  sortBy?: string; // Sort field
}

/**
 * Extended user filters
 */
export interface ExtendedUserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  status?: string; // User status filter
}

// ============================================================================
// Students Type Extensions
// ============================================================================

/**
 * Extended student update request
 */
export interface ExtendedUpdateStudentData {
  id?: string;
  data?: any; // Nested update data structure
  student?: any; // Alternative nested structure
}

/**
 * Extended students list options
 */
export interface ExtendedUseStudentsListOptions {
  enableInfiniteScroll?: boolean; // Enable infinite scroll pagination
}

// ============================================================================
// Documents Type Extensions
// ============================================================================

/**
 * Extended proxy configuration
 */
export interface ExtendedProxyConfig {
  method?: string;
  body?: any; // Request body for proxy
  params?: Record<string, any>;
  headers?: Record<string, string>; // Request headers
}

// ============================================================================
// Appointments Type Extensions
// ============================================================================

/**
 * Extended appointment form data
 */
export interface ExtendedAppointmentFormData {
  studentId: string;
  nurseId?: string;
  date: string;
  duration: number;
  startTime?: string;
  endTime?: string;
  workingHours?: {
    start: string;
    end: string;
    breaks?: Array<{ start: string; end: string }>;
  }; // Nurse working hours for scheduling
}

// ============================================================================
// Reports Type Extensions
// ============================================================================

/**
 * Extended schedule update request
 */
export interface ExtendedUpdateScheduleRequest {
  name?: string;
  frequency?: any;
  recipients?: string[];
  format?: string;
  filters?: any;
  enabled?: boolean; // Schedule enabled/disabled state
}

// ============================================================================
// Component Props Extensions
// ============================================================================

/**
 * Communication templates tab props
 */
export interface CommunicationTemplatesTabProps {
  templates?: any[];
  formData?: any;
  onFormChange?: (data: any) => void;
  onSubmit?: () => void;
  onTemplateSelect?: (template: any) => void;
  onTemplateDelete?: (templateId: string) => void;
}

// ============================================================================
// Service Configuration Extensions
// ============================================================================

/**
 * Extended audit config
 */
export interface ExtendedAuditConfig {
  enabled?: boolean;
  logLevel?: string;
  storage?: string;
  retention?: number;
}

/**
 * Extended bulkhead config
 */
export interface ExtendedBulkheadConfig {
  enabled: boolean;
  maxConcurrent: number;
  maxQueue: number;
  timeout: number;
  criticalMaxConcurrent?: number;
  highMaxConcurrent?: number;
  normalMaxConcurrent?: number;
  lowMaxConcurrent?: number;
  criticalMaxQueue?: number;
  highMaxQueue?: number;
  normalMaxQueue?: number;
}

// ============================================================================
// API Extensions
// ============================================================================

/**
 * Extended API request options
 */
export interface ExtendedApiRequestOptions {
  method?: string;
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}
