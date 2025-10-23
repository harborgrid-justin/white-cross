/**
 * @fileoverview GraphQL Response Types
 * @module types/graphql/responses
 * @category Types
 *
 * Comprehensive type definitions for GraphQL query and mutation responses.
 * This file centralizes all GraphQL response types to ensure type safety
 * across Apollo Client and TanStack Query hooks.
 *
 * Design Principles:
 * - All mutation responses extend BaseMutationResponse
 * - Query responses wrap data in appropriate response wrappers
 * - Support for both GraphQL and REST API patterns
 * - Consistent error handling structure
 * - Type-safe data extraction
 *
 * Usage:
 * - Import specific response types for your domain
 * - Use generic types for custom responses
 * - Leverage type guards for runtime safety
 *
 * @example
 * ```typescript
 * // Mutation with typed response
 * const { mutate } = useMutation<CreateAppointmentResponse, Error, AppointmentFormData>({
 *   mutationFn: (data) => appointmentsApi.create(data)
 * });
 *
 * // Query with typed response
 * const { data } = useQuery<AppointmentsQueryResponse>({
 *   queryKey: ['appointments'],
 *   queryFn: () => appointmentsApi.getAll()
 * });
 * ```
 */

// Re-export common response types from api/responses.ts
export type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ErrorDetail,
  PaginatedResponse,
  PaginationInfo,
  MutationResponse,
  BulkOperationResponse,
} from '../api/responses';

// Re-export domain-specific response types
export type {
  IncidentReportResponse,
  IncidentReportListResponse,
  WitnessStatementResponse,
  WitnessStatementListResponse,
  FollowUpActionResponse,
  FollowUpActionListResponse,
  InsuranceSubmissionResponse,
  InsuranceSubmissionsResponse,
} from '../incidents';

// ==========================================
// GENERIC GRAPHQL RESPONSE TYPES
// ==========================================

/**
 * Generic GraphQL response wrapper
 * Wraps any data type in a standardized GraphQL response format
 *
 * @template T - The type of the response data
 */
export interface GraphQLResponse<T = unknown> {
  /** Indicates if the operation was successful */
  success: boolean;

  /** The actual response data */
  data: T;

  /** Optional message about the operation */
  message?: string;

  /** Array of validation or execution errors */
  errors?: GraphQLError[];

  /** Extensions with additional metadata */
  extensions?: Record<string, unknown>;
}

/**
 * GraphQL error structure
 */
export interface GraphQLError {
  /** Error message */
  message: string;

  /** Path in the GraphQL query where error occurred */
  path?: (string | number)[];

  /** Source locations in the query */
  locations?: Array<{ line: number; column: number }>;

  /** Error code for programmatic handling */
  code?: string;

  /** Additional error context */
  extensions?: Record<string, unknown>;
}

// ==========================================
// MUTATION RESPONSE TYPES
// ==========================================

/**
 * Base mutation response structure
 * All mutation responses should follow this pattern
 *
 * @template T - The type of the created/updated entity
 */
export interface BaseMutationResponse<T = unknown> {
  /** Indicates operation success */
  success: boolean;

  /** Success message */
  message?: string;

  /** Array of errors if operation failed */
  errors?: GraphQLError[];
}

/**
 * Create mutation response
 * Used for create operations that return the newly created entity
 *
 * @template T - The type of the created entity
 */
export interface CreateResponse<T = unknown> extends BaseMutationResponse<T> {
  /** The created entity */
  data: T;
}

/**
 * Update mutation response
 * Used for update operations that return the updated entity
 *
 * @template T - The type of the updated entity
 */
export interface UpdateResponse<T = unknown> extends BaseMutationResponse<T> {
  /** The updated entity */
  data: T;
}

/**
 * Delete mutation response
 * Used for delete operations
 */
export interface DeleteResponse extends BaseMutationResponse {
  /** ID of the deleted entity */
  id: string;

  /** Indicates successful deletion */
  success: true;
}

/**
 * Bulk mutation response
 * Used for operations affecting multiple records
 */
export interface BulkMutationResponse extends BaseMutationResponse {
  /** Number of successfully processed records */
  successful: number;

  /** Number of failed records */
  failed: number;

  /** Total records processed */
  total: number;

  /** Array of successfully processed IDs */
  successfulIds?: string[];

  /** Array of failed IDs with error details */
  failedItems?: Array<{
    id: string;
    error: string;
  }>;
}

// ==========================================
// QUERY RESPONSE TYPES
// ==========================================

/**
 * Query response wrapper
 * Used for single-entity queries
 *
 * @template T - The type of the queried entity
 */
export interface QueryResponse<T = unknown> {
  /** The queried data */
  data: T;

  /** Array of errors if query failed */
  errors?: GraphQLError[];
}

/**
 * List query response
 * Used for queries returning arrays of entities
 *
 * @template T - The type of entities in the list
 */
export interface ListQueryResponse<T = unknown> {
  /** Array of entities */
  data: T[];

  /** Total count across all pages */
  total?: number;

  /** Array of errors if query failed */
  errors?: GraphQLError[];
}

/**
 * Paginated query response
 * Used for paginated list queries
 *
 * @template T - The type of entities in the list
 */
export interface PaginatedQueryResponse<T = unknown> {
  /** Array of entities for current page */
  data: T[];

  /** Pagination metadata */
  pagination: {
    /** Current page number (1-indexed) */
    page: number;

    /** Items per page */
    limit: number;

    /** Total number of items */
    total: number;

    /** Total number of pages */
    totalPages: number;

    /** Whether there's a next page */
    hasNext: boolean;

    /** Whether there's a previous page */
    hasPrev: boolean;
  };

  /** Array of errors if query failed */
  errors?: GraphQLError[];
}

// ==========================================
// DOMAIN-SPECIFIC MUTATION RESPONSES
// ==========================================

/**
 * Appointment mutation responses
 */
export interface CreateAppointmentResponse {
  appointment: import('../appointments').Appointment;
}

export interface UpdateAppointmentResponse {
  appointment: import('../appointments').Appointment;
}

export interface CancelAppointmentResponse {
  appointment: import('../appointments').Appointment;
}

export interface MarkNoShowResponse {
  appointment: import('../appointments').Appointment;
}

export interface CreateRecurringAppointmentsResponse {
  count: number;
  appointments: import('../appointments').Appointment[];
}

/**
 * Waitlist mutation responses
 */
export interface AddToWaitlistResponse {
  success: boolean;
  message: string;
}

export interface RemoveFromWaitlistResponse {
  success: boolean;
  message: string;
}

/**
 * Nurse availability mutation responses
 */
export interface SetAvailabilityResponse {
  availability: import('../appointments').NurseAvailability;
}

export interface UpdateAvailabilityResponse {
  availability: import('../appointments').NurseAvailability;
}

export interface DeleteAvailabilityResponse {
  success: boolean;
  id: string;
}

/**
 * Incident report mutation responses
 * Re-exports from incidents.ts for convenience
 */
export type {
  IncidentReportResponse as CreateIncidentReportResponse,
  IncidentReportResponse as UpdateIncidentReportResponse,
  WitnessStatementResponse as CreateWitnessStatementResponse,
  WitnessStatementResponse as UpdateWitnessStatementResponse,
  FollowUpActionResponse as CreateFollowUpActionResponse,
  FollowUpActionResponse as UpdateFollowUpActionResponse,
} from '../incidents';

/**
 * Delete incident report response
 */
export interface DeleteIncidentReportResponse {
  success: boolean;
  id: string;
}

/**
 * Delete witness statement response
 */
export interface DeleteWitnessStatementResponse {
  success: boolean;
  id: string;
}

/**
 * Delete follow-up action response
 */
export interface DeleteFollowUpActionResponse {
  success: boolean;
  id: string;
}

/**
 * Complete follow-up action response
 */
export interface CompleteFollowUpActionResponse {
  action: import('../incidents').FollowUpAction;
}

/**
 * Verify witness statement response
 */
export interface VerifyWitnessStatementResponse {
  statement: import('../incidents').WitnessStatement;
}

/**
 * Health records mutation responses
 */
export interface CreateHealthRecordResponse {
  record: import('../api').HealthRecord;
}

export interface UpdateHealthRecordResponse {
  record: import('../api').HealthRecord;
}

export interface DeleteHealthRecordResponse {
  success: boolean;
  id: string;
}

/**
 * Student mutation responses
 */
export interface CreateStudentResponse {
  student: import('../common').Student;
}

export interface UpdateStudentResponse {
  student: import('../common').Student;
}

export interface DeleteStudentResponse {
  success: boolean;
  id: string;
}

// ==========================================
// QUERY RESPONSE WRAPPERS
// ==========================================

/**
 * Appointments query responses
 */
export interface AppointmentsQueryResponse {
  appointments: import('../appointments').Appointment[];
}

export interface UpcomingAppointmentsQueryResponse {
  appointments: import('../appointments').Appointment[];
}

export interface AppointmentStatisticsQueryResponse {
  statistics: import('../appointments').AppointmentStatistics;
}

export interface WaitlistQueryResponse {
  waitlist: import('../appointments').WaitlistEntryData[];
}

export interface AvailabilityQueryResponse {
  slots: import('../appointments').AvailabilitySlot[];
}

export interface NurseAvailabilityQueryResponse {
  availability: import('../appointments').NurseAvailability[];
}

/**
 * Incident reports query responses
 */
export interface IncidentsQueryResponse {
  reports: import('../incidents').IncidentReport[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IncidentQueryResponse {
  report: import('../incidents').IncidentReport;
}

export interface WitnessStatementsQueryResponse {
  statements: import('../incidents').WitnessStatement[];
}

export interface FollowUpActionsQueryResponse {
  actions: import('../incidents').FollowUpAction[];
}

/**
 * Health records query responses
 */
export interface HealthRecordsQueryResponse {
  records: import('../api').HealthRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HealthRecordQueryResponse {
  record: import('../api').HealthRecord;
}

/**
 * Students query responses
 */
export interface StudentsQueryResponse {
  students: import('../common').Student[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StudentQueryResponse {
  student: import('../common').Student;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: GraphQLResponse<T> | ErrorResponse
): response is GraphQLResponse<T> {
  return response.success === true && !response.errors;
}

/**
 * Type guard to check if response contains errors
 */
export function isErrorResponse(
  response: GraphQLResponse<unknown> | ErrorResponse
): response is ErrorResponse {
  return response.success === false || (response.errors !== undefined && response.errors.length > 0);
}

/**
 * Type guard for paginated responses
 */
export function isPaginatedResponse<T>(
  response: QueryResponse<T> | PaginatedQueryResponse<T>
): response is PaginatedQueryResponse<T> {
  return 'pagination' in response;
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Extract data type from a response
 */
export type ResponseData<T> = T extends GraphQLResponse<infer U>
  ? U
  : T extends QueryResponse<infer U>
  ? U
  : T extends PaginatedQueryResponse<infer U>
  ? U[]
  : never;

/**
 * Extract entity type from mutation response
 */
export type MutationEntityType<T> = T extends CreateResponse<infer U>
  ? U
  : T extends UpdateResponse<infer U>
  ? U
  : never;
