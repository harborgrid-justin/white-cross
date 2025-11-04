/**
 * WF-COMP-129 | useEmergencyContacts.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../services/modules/emergencyContactsApi | Dependencies: @tanstack/react-query, react-hot-toast, ../services/modules/emergencyContactsApi
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Custom React Query Hooks for Emergency Contacts
 *
 * Enterprise-grade hooks with:
 * - Type-safe API integration
 * - Automatic caching and invalidation
 * - Optimistic updates for better UX
 * - Error handling and retry strategies
 * - HIPAA-compliant data handling
 * - Multi-channel communication support
 *
 * @module useEmergencyContacts
 */

// Re-export types
export type {
  EmergencyContact,
  CreateEmergencyContactRequest,
  UpdateEmergencyContactRequest,
  NotificationRequest,
  EmergencyContactStatistics,
  VerificationMethod,
} from './useEmergencyContacts.types';

// Re-export constants and utilities
export {
  STALE_TIME,
  CACHE_TIME,
  RETRY_CONFIG,
  emergencyContactsKeys,
  handleQueryError,
  shouldRetry,
} from './useEmergencyContacts.constants';

// Re-export query hooks
export {
  useEmergencyContacts,
  useEmergencyContactStatistics,
} from './useEmergencyContacts.queries';

// Re-export mutation hooks
export {
  useCreateEmergencyContact,
  useUpdateEmergencyContact,
  useDeleteEmergencyContact,
  useNotifyStudentContacts,
  useNotifyContact,
  useVerifyContact,
} from './useEmergencyContacts.mutations';
