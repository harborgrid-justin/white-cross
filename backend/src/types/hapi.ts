/**
 * WC-TYP-HAP-065 | hapi.ts - Hapi.js Framework Type Definitions
 * Purpose: Comprehensive TypeScript types for HIPAA-compliant Hapi.js API with authentication, healthcare routes
 * Upstream: @hapi/hapi, @hapi/boom | Dependencies: Hapi framework types, Boom error handling
 * Downstream: All ../routes/*.ts files, ../middleware/*.ts | Called by: route handlers, middleware, services
 * Related: ../types/express.d.ts, ../middleware/auth-sequelize.ts, ../services/*.ts
 * Exports: AuthenticatedRequest, RouteHandler, ApiResponse, healthcare route types | Key Services: Type safety for healthcare API
 * Last Updated: 2025-10-18 | File Type: .ts | Pattern: Type Definitions
 * Critical Path: Request type → Authentication → Route validation → Response formatting
 * LLM Context: Healthcare API types with HIPAA compliance, student records, medications, appointments, incident reports, inventory management
 */

/**
 * Hapi.js Type Definitions
 * Strongly-typed request/response handlers for HIPAA-compliant API
 *
 * Purpose: Replace all 'any' types in route handlers with proper types
 * Security: Type-safe request validation prevents injection attacks
 */

import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import * as Boom from '@hapi/boom';

/**
 * Authenticated user credentials from JWT
 */
export interface AuthCredentials {
  userId: string;
  email: string;
  role: string;
  schoolId?: string;
  districtId?: string;
  iat?: number;
  exp?: number;
}

/**
 * Base authenticated request
 * All protected routes extend this
 */
export interface AuthenticatedRequest extends Omit<Request, 'auth'> {
  auth: {
    isAuthenticated: true;
    credentials: AuthCredentials;
    artifacts?: any;
    strategy: string;
    mode?: string;
    error?: Error;
  };
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
}

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Success response builder
 */
export function successResponse<T>(
  h: ResponseToolkit,
  data: T,
  statusCode: number = 200
): ResponseObject {
  return h.response({
    success: true,
    data
  }).code(statusCode);
}

/**
 * Success response with pagination
 */
export function paginatedResponse<T>(
  h: ResponseToolkit,
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  }
): ResponseObject {
  return h.response({
    success: true,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    }
  }).code(200);
}

/**
 * Error response builder
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Boom.Boom {
  const error = Boom.boomify(new Error(message), { statusCode });
  if (code) {
    error.output.payload.code = code;
  }
  if (details) {
    error.output.payload.details = details;
  }
  return error;
}

/**
 * Generic route handler type
 */
export type RouteHandler<TRequest = Request, TResponse = any> = (
  request: TRequest,
  h: ResponseToolkit
) => Promise<ResponseObject | Boom.Boom> | ResponseObject | Boom.Boom;

/**
 * Authenticated route handler type
 */
export type AuthenticatedHandler<TQuery = any, TPayload = any, TParams = any, TResponse = any> = RouteHandler<
  AuthenticatedRequest & {
    query: TQuery;
    payload: TPayload;
    params: TParams;
  },
  TResponse
>;

// ==================== STUDENT ROUTES ====================

export interface GetStudentsQuery extends PaginationQuery {
  search?: string;
  grade?: string;
  isActive?: boolean;
  nurseId?: string;
}

export interface CreateStudentPayload {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  schoolId: string;
  nurseId?: string;
  emergencyContacts?: Array<{
    firstName: string;
    lastName: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary: boolean;
  }>;
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {
  isActive?: boolean;
}

export interface StudentParams {
  id: string;
}

// ==================== MEDICATION ROUTES ====================

export interface GetMedicationsQuery extends PaginationQuery {
  search?: string;
  category?: string;
  isActive?: boolean;
}

export interface CreateMedicationPayload {
  name: string;
  genericName?: string;
  category: string;
  dosageForm: string;
  strength?: string;
  manufacturer?: string;
  ndcCode?: string;
  description?: string;
}

export interface AssignMedicationPayload {
  studentId: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribingPhysician?: string;
  instructions?: string;
}

export interface MedicationAdministrationPayload {
  studentMedicationId: string;
  dosageGiven: string;
  timeGiven: string;
  administeredBy: string;
  notes?: string;
}

export interface MedicationParams {
  id: string;
}

// ==================== HEALTH RECORD ROUTES ====================

export interface GetHealthRecordsQuery extends PaginationQuery {
  studentId?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  isConfidential?: boolean;
}

export interface CreateHealthRecordPayload {
  studentId: string;
  recordType: string;
  title: string;
  description?: string;
  date: string;
  provider?: string;
  providerNpi?: string;
  facility?: string;
  facilityNpi?: string;
  diagnosisCode?: string;
  isConfidential?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateHealthRecordPayload extends Partial<CreateHealthRecordPayload> {}

export interface HealthRecordParams {
  id: string;
}

// ==================== APPOINTMENT ROUTES ====================

export interface GetAppointmentsQuery extends PaginationQuery {
  studentId?: string;
  nurseId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateAppointmentPayload {
  studentId: string;
  nurseId: string;
  type: string;
  scheduledAt: string;
  duration: number;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentPayload extends Partial<CreateAppointmentPayload> {
  status?: string;
}

export interface AppointmentParams {
  id: string;
}

// ==================== USER ROUTES ====================

export interface GetUsersQuery extends PaginationQuery {
  search?: string;
  role?: string;
  schoolId?: string;
  districtId?: string;
  isActive?: boolean;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
  districtId?: string;
  phone?: string;
}

export interface UpdateUserPayload extends Partial<Omit<CreateUserPayload, 'password'>> {
  isActive?: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserParams {
  id: string;
}

// ==================== AUTH ROUTES ====================

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  schoolId?: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

// ==================== INCIDENT REPORT ROUTES ====================

export interface GetIncidentReportsQuery extends PaginationQuery {
  studentId?: string;
  reportedById?: string;
  type?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateIncidentReportPayload {
  studentId: string;
  reportedById: string;
  type: string;
  severity: string;
  occurredAt: string;
  location: string;
  description: string;
  witnesses?: string[];
  actionsTaken?: string;
  parentNotified?: boolean;
  parentNotifiedAt?: string;
}

export interface UpdateIncidentReportPayload extends Partial<CreateIncidentReportPayload> {
  status?: string;
}

export interface IncidentReportParams {
  id: string;
}

// ==================== DOCUMENT ROUTES ====================

export interface GetDocumentsQuery extends PaginationQuery {
  studentId?: string;
  category?: string;
  uploadedById?: string;
}

export interface UploadDocumentPayload {
  title: string;
  category: string;
  description?: string;
  studentId?: string;
  file: Buffer;
  filename: string;
  mimeType: string;
}

export interface DocumentParams {
  id: string;
}

// ==================== REPORT ROUTES ====================

export interface GenerateReportQuery {
  type: string;
  format?: string;
  dateFrom?: string;
  dateTo?: string;
  schoolId?: string;
  districtId?: string;
  filters?: string; // JSON string
}

// ==================== COMMUNICATION ROUTES ====================

export interface SendMessagePayload {
  recipientIds: string[];
  subject: string;
  body: string;
  channel: 'email' | 'sms' | 'push';
  priority?: string;
  scheduledAt?: string;
}

export interface BroadcastMessagePayload {
  audience: string;
  subject: string;
  body: string;
  channels: Array<'email' | 'sms' | 'push'>;
  schoolIds?: string[];
  districtId?: string;
}

export interface EmergencyAlertPayload {
  type: string;
  severity: string;
  title: string;
  message: string;
  schoolIds: string[];
  notifyParents?: boolean;
  notifyStaff?: boolean;
}

// ==================== INVENTORY ROUTES ====================

export interface GetInventoryQuery extends PaginationQuery {
  category?: string;
  location?: string;
  lowStock?: boolean;
  expiringWithinDays?: number;
}

export interface CreateInventoryItemPayload {
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  location?: string;
  minimumStock?: number;
  expirationDate?: string;
}

export interface UpdateInventoryPayload extends Partial<CreateInventoryItemPayload> {}

export interface InventoryTransactionPayload {
  inventoryItemId: string;
  type: 'addition' | 'removal' | 'adjustment';
  quantity: number;
  reason: string;
  performedBy: string;
}

export interface InventoryParams {
  id: string;
}

// ==================== REQUEST EXTENSIONS ====================

/**
 * Extend Request with custom properties
 */
declare module '@hapi/hapi' {
  interface Request {
    auditStartTime?: number;
    cspNonce?: string;
  }
}

/**
 * Type helper for extracting handler parameters
 */
export type ExtractQuery<T> = T extends AuthenticatedHandler<infer Q, any, any, any> ? Q : never;
export type ExtractPayload<T> = T extends AuthenticatedHandler<any, infer P, any, any> ? P : never;
export type ExtractParams<T> = T extends AuthenticatedHandler<any, any, infer Params, any> ? Params : never;

/**
 * Helper to create typed route handler
 */
export function createHandler<TQuery = any, TPayload = any, TParams = any, TResponse = any>(
  handler: AuthenticatedHandler<TQuery, TPayload, TParams, TResponse>
): AuthenticatedHandler<TQuery, TPayload, TParams, TResponse> {
  return handler;
}

/**
 * Helper to create public route handler (no auth required)
 */
export function createPublicHandler<TQuery = any, TPayload = any, TParams = any, TResponse = any>(
  handler: RouteHandler<
    Request & {
      query: TQuery;
      payload: TPayload;
      params: TParams;
    },
    TResponse
  >
): typeof handler {
  return handler;
}

export default {
  successResponse,
  paginatedResponse,
  errorResponse,
  createHandler,
  createPublicHandler
};
