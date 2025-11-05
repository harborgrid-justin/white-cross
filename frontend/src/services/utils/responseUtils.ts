/**
 * @fileoverview Response Utilities for Type-Safe API Response Handling
 * @module services/utils/responseUtils
 * @category Services
 *
 * Provides type-safe utilities for unwrapping and validating API responses from the backend.
 * Handles the common pattern of nested response structures (response.data.data) and provides
 * specialized unwrapping for paginated, nested, and array responses.
 *
 * Response Structure:
 * - Standard: { success: boolean, data: T, message?: string, errors?: Record }
 * - Paginated: { data: { items: T[], total, page, limit, ... } }
 * - Nested: { data: { [propertyName]: T } }
 * - Array: { data: { [propertyName]: T[] } }
 *
 * Healthcare Safety:
 * - Type-safe unwrapping prevents data corruption
 * - Validation ensures data integrity before processing
 * - Clear error messages for debugging PHI-related issues
 * - Supports HIPAA-compliant error handling (no PHI in exceptions)
 *
 * Type Safety Features:
 * - Generic type parameters preserve response typing
 * - Type guards for response validation
 * - Comprehensive error handling with ApiError
 * - Prevents runtime type mismatches
 *
 * @example
 * ```typescript
 * // Basic response unwrapping
 * import { unwrapApiResponse } from '@/services/utils/responseUtils';
 *
 * const response = await apiClient.get<ApiResponse<Patient>>('/api/patients/123');
 * const patient = unwrapApiResponse(response);
 * // patient is typed as Patient
 *
 * // Paginated response unwrapping
 * const paginatedResponse = await apiClient.get('/api/patients');
 * const { data, total, page } = unwrapPaginatedResponse<Patient>(paginatedResponse);
 *
 * // Nested response unwrapping
 * const nestedResponse = await apiClient.get('/api/user/profile');
 * const profile = unwrapNestedResponse<UserProfile>(nestedResponse, 'profile');
 * ```
 *
 * @see {@link ApiResponse} for response structure
 * @see {@link ApiError} for error handling
 */

import { AxiosResponse } from 'axios';
import { ApiResponse } from './apiUtils';
import { ApiError } from '../core/errors';

/**
 * Unwrap API response data safely with comprehensive validation
 *
 * @template T - Type of the unwrapped data
 * @param {AxiosResponse<ApiResponse<T>>} response - Axios response with ApiResponse wrapper structure
 * @returns {T} Unwrapped and validated data of type T
 * @throws {ApiError} If response is null or undefined
 * @throws {ApiError} If response.data is missing (invalid structure)
 * @throws {ApiError} If response.data.success is false (API request failed)
 * @throws {ApiError} If response.data.data is undefined (invalid structure)
 *
 * @description
 * Handles the common pattern of nested response structures (response.data.data) with
 * comprehensive validation at each level. Validates response existence, data property,
 * success flag, and data.data property before returning the unwrapped value.
 *
 * **Validation Steps**:
 * 1. Verify response exists (not null/undefined)
 * 2. Verify response.data exists
 * 3. Check success flag (throws if false)
 * 4. Verify data.data exists
 * 5. Return unwrapped data with type safety
 *
 * **Error Handling**:
 * - Throws typed ApiError with appropriate error codes
 * - Preserves HTTP status codes in thrown errors
 * - Includes descriptive error messages for debugging
 * - HIPAA-compliant: Does not expose PHI in error messages
 *
 * @example
 * ```typescript
 * // Successful response unwrapping
 * const response = await apiClient.get<ApiResponse<Patient>>('/api/patients/123');
 * const patient = unwrapApiResponse(response);
 * console.log(patient.firstName, patient.lastName);
 *
 * // Handle errors
 * try {
 *   const data = unwrapApiResponse(response);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API Error:', error.message, error.code);
 *   }
 * }
 *
 * // Type safety with generics
 * interface MedicationOrder { id: string; medication: string; dosage: string; }
 * const medResponse = await apiClient.post<ApiResponse<MedicationOrder>>('/api/orders', order);
 * const newOrder = unwrapApiResponse<MedicationOrder>(medResponse);
 * // newOrder is correctly typed as MedicationOrder
 * ```
 *
 * @see {@link ApiResponse} for expected response structure
 * @see {@link ApiError} for error types thrown
 */
export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T>>
): T {
  if (!response) {
    throw new ApiError('Invalid response: response is null or undefined');
  }

  if (!response.data) {
    throw new ApiError('Invalid response structure: missing data property');
  }

  const apiResponse = response.data;

  // Check for success flag
  if (apiResponse.success === false) {
    throw new ApiError(
      apiResponse.message || 'API request failed',
      undefined,
      response.status,
      'API_REQUEST_FAILED'
    );
  }

  // Check for data property
  if (apiResponse.data === undefined) {
    throw new ApiError(
      'Invalid response structure: missing data.data property',
      undefined,
      response.status,
      'INVALID_RESPONSE_STRUCTURE'
    );
  }

  return apiResponse.data;
}

/**
 * Unwrap paginated API response with full pagination metadata
 *
 * @template T - Type of items in the paginated data array
 * @param {AxiosResponse<ApiResponse<PaginatedData>>} response - Axios response with paginated structure
 * @returns {PaginatedResult<T>} Object containing data array and complete pagination metadata
 * @throws {ApiError} If response structure is invalid (delegates to unwrapApiResponse)
 *
 * @description
 * Handles API responses with pagination metadata, supporting both 'data' and 'items'
 * property names for the array of results. Provides sensible defaults for missing
 * pagination fields to ensure consistent return structure.
 *
 * **Supported Response Formats**:
 * - `{ data: { data: T[], total, page, limit, ... } }` - Standard format
 * - `{ data: { items: T[], total, page, limit, ... } }` - Alternative format
 *
 * **Pagination Fields**:
 * - `data`: Array of items (required)
 * - `total`: Total number of items across all pages (defaults to array length)
 * - `page`: Current page number (defaults to 1)
 * - `limit`: Items per page (defaults to array length)
 * - `totalPages`: Total number of pages (defaults to 1)
 * - `hasNext`: Whether there's a next page (defaults to false)
 * - `hasPrev`: Whether there's a previous page (defaults to false)
 *
 * **Healthcare Use Cases**:
 * - Patient lists with pagination
 * - Medication formulary search results
 * - Appointment calendars
 * - Health record browsing
 *
 * @example
 * ```typescript
 * // Fetch paginated patient list
 * const response = await apiClient.get<ApiResponse<PaginatedPatients>>(
 *   '/api/patients?page=2&limit=20'
 * );
 * const {
 *   data,        // Patient[]
 *   total,       // Total patients across all pages
 *   page,        // Current page (2)
 *   limit,       // Items per page (20)
 *   totalPages,  // Total pages
 *   hasNext,     // true if more pages exist
 *   hasPrev      // true if previous pages exist
 * } = unwrapPaginatedResponse<Patient>(response);
 *
 * // Display pagination info
 * console.log(`Showing ${data.length} of ${total} patients`);
 * console.log(`Page ${page} of ${totalPages}`);
 *
 * // Navigation
 * if (hasNext) {
 *   await fetchNextPage();
 * }
 *
 * // Medication search with pagination
 * const medResponse = await medicationApi.search('aspirin', { page: 1, limit: 50 });
 * const { data: medications, total: totalMedications } = unwrapPaginatedResponse(medResponse);
 * ```
 *
 * @see {@link unwrapApiResponse} for base unwrapping logic
 */
export function unwrapPaginatedResponse<T>(
  response: AxiosResponse<ApiResponse<{
    data?: T[];
    items?: T[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  }>>
): {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const unwrapped = unwrapApiResponse(response);

  // Handle both 'data' and 'items' property names
  const items = unwrapped.data || unwrapped.items || [];

  return {
    data: items,
    total: unwrapped.total ?? items.length,
    page: unwrapped.page ?? 1,
    limit: unwrapped.limit ?? items.length,
    totalPages: unwrapped.totalPages ?? 1,
    hasNext: unwrapped.hasNext ?? false,
    hasPrev: unwrapped.hasPrev ?? false,
  };
}

/**
 * Unwrap nested API response with specific property extraction
 *
 * @template T - Type of the nested property value
 * @param {AxiosResponse<ApiResponse<Record<string, T>>>} response - Axios response with nested object structure
 * @param {string} [propertyName='item'] - Name of property to extract from nested object
 * @returns {T} Extracted nested property value
 * @throws {ApiError} If response structure is invalid
 * @throws {ApiError} If unwrapped data is not an object
 * @throws {ApiError} If specified property doesn't exist in nested object
 *
 * @description
 * Handles API responses where the data is wrapped in a nested object with a specific
 * property name. Common for single-item responses or responses with additional metadata.
 *
 * **Response Pattern**:
 * ```
 * {
 *   success: true,
 *   data: {
 *     [propertyName]: T,
 *     metadata?: {},
 *     timestamp?: string
 *   }
 * }
 * ```
 *
 * **Validation**:
 * - Validates response using unwrapApiResponse
 * - Verifies unwrapped data is an object
 * - Verifies specified property exists
 * - Returns undefined check for property
 *
 * **Healthcare Use Cases**:
 * - User profile responses: { data: { profile: UserProfile } }
 * - Single patient record: { data: { patient: Patient } }
 * - Configuration responses: { data: { config: SystemConfig } }
 *
 * @example
 * ```typescript
 * // Extract user profile from nested response
 * const response = await apiClient.get('/api/user/profile');
 * const profile = unwrapNestedResponse<UserProfile>(response, 'profile');
 * console.log(profile.email, profile.role);
 *
 * // Extract patient data with default property name
 * const patientResponse = await apiClient.get('/api/patients/123/details');
 * const patientDetails = unwrapNestedResponse<PatientDetails>(patientResponse, 'item');
 *
 * // Extract configuration settings
 * const configResponse = await apiClient.get('/api/system/config');
 * const config = unwrapNestedResponse<SystemConfig>(configResponse, 'settings');
 *
 * // Handle extraction errors
 * try {
 *   const data = unwrapNestedResponse(response, 'missingProperty');
 * } catch (error) {
 *   console.error('Property not found in response');
 * }
 * ```
 *
 * @see {@link unwrapApiResponse} for base unwrapping logic
 * @see {@link unwrapArrayResponse} for array extraction
 */
export function unwrapNestedResponse<T>(
  response: AxiosResponse<ApiResponse<{ [key: string]: T }>>,
  propertyName: string = 'item'
): T {
  const unwrapped = unwrapApiResponse(response);

  if (!unwrapped || typeof unwrapped !== 'object') {
    throw new ApiError(
      `Invalid nested response: expected object with '${propertyName}' property`,
      undefined,
      response.status,
      'INVALID_NESTED_RESPONSE'
    );
  }

  const item = unwrapped[propertyName];

  if (item === undefined) {
    throw new ApiError(
      `Invalid nested response: missing '${propertyName}' property`,
      undefined,
      response.status,
      'MISSING_NESTED_PROPERTY'
    );
  }

  return item;
}

/**
 * Unwrap array response with property name validation
 *
 * @template T - Type of items in the array
 * @param {AxiosResponse<ApiResponse<Record<string, T[]>>>} response - Axios response with nested array structure
 * @param {string} [propertyName='items'] - Name of array property to extract
 * @returns {T[]} Extracted array of items
 * @throws {ApiError} If response structure is invalid
 * @throws {ApiError} If unwrapped data is not an object
 * @throws {ApiError} If specified property is not an array
 *
 * @description
 * Handles API responses where data contains an array under a specific property name.
 * Validates that the extracted property is actually an array before returning.
 *
 * **Response Pattern**:
 * ```
 * {
 *   success: true,
 *   data: {
 *     [propertyName]: T[],
 *     count?: number,
 *     metadata?: {}
 *   }
 * }
 * ```
 *
 * **Validation**:
 * - Validates response using unwrapApiResponse
 * - Verifies unwrapped data is an object
 * - Verifies specified property exists
 * - Verifies property value is an array (Array.isArray check)
 *
 * **Healthcare Use Cases**:
 * - Medication lists: { data: { medications: Medication[] } }
 * - Allergy lists: { data: { allergies: Allergy[] } }
 * - Vaccination records: { data: { vaccinations: Vaccination[] } }
 * - Appointment schedules: { data: { appointments: Appointment[] } }
 *
 * @example
 * ```typescript
 * // Extract medications array
 * const response = await apiClient.get('/api/patients/123/medications');
 * const medications = unwrapArrayResponse<Medication>(response, 'medications');
 * medications.forEach(med => console.log(med.name, med.dosage));
 *
 * // Extract allergies with default property name
 * const allergyResponse = await apiClient.get('/api/patients/123/allergies');
 * const allergies = unwrapArrayResponse<Allergy>(allergyResponse, 'items');
 *
 * // Extract appointments
 * const apptResponse = await apiClient.get('/api/appointments/upcoming');
 * const upcomingAppointments = unwrapArrayResponse<Appointment>(apptResponse, 'appointments');
 *
 * // Iterate safely over extracted array
 * const vaccinations = unwrapArrayResponse<Vaccination>(response, 'vaccinations');
 * if (vaccinations.length === 0) {
 *   console.log('No vaccination records found');
 * } else {
 *   vaccinations.forEach((vacc, index) => {
 *     console.log(`${index + 1}. ${vacc.vaccine} on ${vacc.date}`);
 *   });
 * }
 * ```
 *
 * @see {@link unwrapNestedResponse} for nested object extraction
 * @see {@link unwrapPaginatedResponse} for paginated arrays
 */
export function unwrapArrayResponse<T>(
  response: AxiosResponse<ApiResponse<{ [key: string]: T[] }>>,
  propertyName: string = 'items'
): T[] {
  const unwrapped = unwrapApiResponse(response);

  if (!unwrapped || typeof unwrapped !== 'object') {
    throw new ApiError(
      `Invalid array response: expected object with '${propertyName}' property`,
      undefined,
      response.status,
      'INVALID_ARRAY_RESPONSE'
    );
  }

  const items = unwrapped[propertyName];

  if (!Array.isArray(items)) {
    throw new ApiError(
      `Invalid array response: '${propertyName}' is not an array`,
      undefined,
      response.status,
      'INVALID_ARRAY_PROPERTY'
    );
  }

  return items;
}

/**
 * Type guard to check if response is an API error response
 *
 * @param {any} response - Response object to check
 * @returns {boolean} True if response matches API error structure
 *
 * @description
 * Validates that a response object matches the expected API error response structure.
 * Useful for error handling and response validation before processing.
 *
 * **Expected Error Structure**:
 * ```typescript
 * {
 *   success: false,
 *   message: string,
 *   errors?: Record<string, string[]>,
 *   code?: string
 * }
 * ```
 *
 * **Type Narrowing**:
 * After this guard returns true, TypeScript will narrow the response type to
 * include success, message, errors, and code properties.
 *
 * **Healthcare Safety**:
 * - Validates error structure before processing
 * - Ensures error messages exist for user feedback
 * - Supports validation error details
 * - Compatible with HIPAA-compliant error responses
 *
 * @example
 * ```typescript
 * // Check response type before processing
 * const response = await apiClient.get('/api/patients/123');
 * if (isApiErrorResponse(response.data)) {
 *   console.error('API Error:', response.data.message);
 *   if (response.data.errors) {
 *     Object.entries(response.data.errors).forEach(([field, messages]) => {
 *       console.error(`${field}: ${messages.join(', ')}`);
 *     });
 *   }
 * }
 *
 * // In error handler
 * catch (error) {
 *   if (error.response && isApiErrorResponse(error.response.data)) {
 *     showErrorNotification(error.response.data.message);
 *   }
 * }
 *
 * // Validate error structure
 * function handleApiResponse(response: unknown) {
 *   if (isApiErrorResponse(response)) {
 *     // TypeScript knows response has success, message, errors, code
 *     return { error: response.message, code: response.code };
 *   }
 * }
 * ```
 *
 * @see {@link isApiSuccessResponse} for success response validation
 */
export function isApiErrorResponse(response: any): response is {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
} {
  return (
    response &&
    typeof response === 'object' &&
    response.success === false &&
    typeof response.message === 'string'
  );
}

/**
 * Type guard to check if response is an API success response
 *
 * @template T - Expected type of response data
 * @param {any} response - Response object to check
 * @returns {boolean} True if response matches API success structure
 *
 * @description
 * Validates that a response object matches the expected API success response structure.
 * Checks for the presence of a 'data' property and that success flag is not false.
 *
 * **Expected Success Structure**:
 * ```typescript
 * {
 *   success?: true | undefined,  // Not false
 *   data: T,
 *   message?: string
 * }
 * ```
 *
 * **Type Narrowing**:
 * After this guard returns true, TypeScript will narrow the response type to
 * ApiResponse<T> with guaranteed data property.
 *
 * **Validation Logic**:
 * - Response must be an object (not null)
 * - success flag must not be explicitly false
 * - 'data' property must exist (can be any value including null)
 *
 * @example
 * ```typescript
 * // Validate success response before unwrapping
 * const response = await apiClient.get('/api/medications');
 * if (isApiSuccessResponse<Medication[]>(response.data)) {
 *   const medications = response.data.data;
 *   // Process medications safely
 * }
 *
 * // Generic response handling
 * function processResponse<T>(response: unknown): T | null {
 *   if (isApiSuccessResponse<T>(response)) {
 *     return response.data;
 *   }
 *   return null;
 * }
 *
 * // In interceptor or middleware
 * axiosInstance.interceptors.response.use(
 *   response => {
 *     if (isApiSuccessResponse(response.data)) {
 *       console.log('Success response received');
 *       return response;
 *     }
 *     throw new Error('Invalid response structure');
 *   }
 * );
 *
 * // Type-safe conditional processing
 * const apiResponse = await fetch('/api/data').then(r => r.json());
 * if (isApiSuccessResponse<PatientData>(apiResponse)) {
 *   // apiResponse.data is typed as PatientData
 *   updatePatientRecord(apiResponse.data);
 * } else if (isApiErrorResponse(apiResponse)) {
 *   // apiResponse is typed as error response
 *   handleError(apiResponse.message);
 * }
 * ```
 *
 * @see {@link isApiErrorResponse} for error response validation
 * @see {@link unwrapApiResponse} for response unwrapping
 */
export function isApiSuccessResponse<T>(
  response: any
): response is ApiResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    response.success !== false &&
    'data' in response
  );
}
