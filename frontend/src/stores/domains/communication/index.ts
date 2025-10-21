/**
 * Communication Domain Store
 * 
 * Handles all communication functionality including messaging, notifications,
 * emergency alerts, and document sharing. This domain manages interaction
 * between nurses, parents, students, and administrators.
 * 
 * @domain communication
 */

// Re-export existing communication-related slices with domain organization
export {
  // Communication slice - messaging and notifications
  communicationSlice,
  communicationActions,
  communicationThunks,
  communicationSelectors,
  selectSentMessages,
  selectMessagesByType,
} from '../../slices/communicationSlice';

export {
  // Documents slice - document sharing and management
  documentsSlice,
  documentsActions,
  documentsThunks,
  documentsSelectors,
  selectDocumentsByStudent,
  selectDocumentsByType,
} from '../../slices/documentsSlice';

// Domain-specific selectors and hooks
export * from './selectors';
export * from './hooks';
export * from './types';