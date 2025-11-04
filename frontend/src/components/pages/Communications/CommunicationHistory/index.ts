/**
 * CommunicationHistory component and related exports
 *
 * This module provides a comprehensive communication history browser
 * with search, filtering, and viewing capabilities.
 */

// Main component
export { CommunicationHistory, default } from './CommunicationHistory';

// Child components (for potential reuse)
export { HistorySearch } from './HistorySearch';
export { HistoryFilters } from './HistoryFilters';
export { ChannelFilter } from './ChannelFilter';
export { HistoryList } from './HistoryList';
export { MessageViewer } from './MessageViewer';

// Types (for external consumers)
export type {
  CommunicationRecord,
  HistoryFilters,
  CommunicationHistoryProps
} from './types';

// Hooks (for potential reuse)
export {
  useCommunicationHistory,
  useHistoryFilters,
  useRecordSelection
} from './hooks';

export type {
  UseCommunicationHistoryReturn,
  UseHistoryFiltersReturn,
  UseRecordSelectionReturn
} from './hooks';

// Utilities (for potential reuse)
export {
  getTypeIcon,
  getStatusBadge,
  getPriorityBadge,
  formatFileSize,
  filterCommunications,
  sortCommunications,
  filterAndSortCommunications
} from './utils';
