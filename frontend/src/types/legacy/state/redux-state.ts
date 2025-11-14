/**
 * WF-COMP-334 | redux-state.ts - Redux store state definitions
 * Purpose: Redux store slice type definitions
 * Upstream: utility-state.ts, incidents.ts, common.ts | Dependencies: State utilities, domain types
 * Downstream: Redux slices, selectors, components | Called by: Redux consumers
 * Related: utility-state.ts, action-payloads.ts, async-thunk.ts
 * Exports: State slice interfaces, RootState | Key Features: Normalized state
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: State definition → Slice creation → Selector usage → Component rendering
 * LLM Context: Redux store state shape definitions for the application
 */

/**
 * Redux Store State Definitions
 *
 * Type definitions for all Redux store slices and the root state.
 * Defines the complete shape of the application's Redux store.
 *
 * @module types/state/redux-state
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus,
} from '../incidents';
import type { User } from '../common';
import type {
  EntityState,
  LoadingState,
  ErrorState,
  PaginationState,
  SortState,
  FilterState,
  SelectionState,
  FormState,
} from './utility-state';

// =====================
// INCIDENT REPORTS STATE
// =====================

/**
 * Incident Reports state slice
 * Manages incident report data in normalized form with pagination
 */
export interface IncidentReportsState {
  /** Normalized incident entities */
  entities: EntityState<IncidentReport>;
  /** Loading and error state */
  loading: LoadingState<ErrorState>;
  /** Pagination state */
  pagination: PaginationState;
  /** Sort configuration */
  sort: SortState;
  /** Filter state */
  filters: FilterState<{
    type?: IncidentType;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    studentId?: string;
    reportedById?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    parentNotified?: boolean;
    followUpRequired?: boolean;
  }>;
  /** Selection state */
  selection: SelectionState<IncidentReport>;
  /** Currently viewed incident ID */
  currentIncidentId: string | null;
  /** Search query */
  searchQuery: string;
  /** Cache timestamp for data freshness */
  cacheTimestamp: number | null;
}

// =====================
// WITNESS STATEMENTS STATE
// =====================

/**
 * Witness Statements state slice
 * Manages witness statement data grouped by incident
 */
export interface WitnessStatementsState {
  /** Witness statements by incident ID */
  byIncidentId: Record<string, EntityState<WitnessStatement>>;
  /** Loading states by incident ID */
  loadingByIncidentId: Record<string, LoadingState<ErrorState>>;
  /** Currently editing statement ID */
  editingStatementId: string | null;
  /** Form state for new statement */
  formState: FormState<{
    incidentReportId: string;
    witnessName: string;
    witnessType: WitnessType;
    witnessContact?: string;
    statement: string;
  }> | null;
}

// =====================
// FOLLOW-UP ACTIONS STATE
// =====================

/**
 * Follow-Up Actions state slice
 * Manages follow-up action tracking and assignments
 */
export interface FollowUpActionsState {
  /** Follow-up actions by incident ID */
  byIncidentId: Record<string, EntityState<FollowUpAction>>;
  /** Loading states by incident ID */
  loadingByIncidentId: Record<string, LoadingState<ErrorState>>;
  /** Actions by assigned user ID */
  byAssignedUserId: Record<string, string[]>;
  /** Overdue actions */
  overdueActionIds: string[];
  /** Completed actions count */
  completedCount: number;
  /** Pending actions count */
  pendingCount: number;
  /** Filter by priority */
  priorityFilter: ActionPriority | 'ALL';
  /** Filter by status */
  statusFilter: ActionStatus | 'ALL';
}

// =====================
// UI STATE
// =====================

/**
 * UI state slice
 * Manages global UI state including modals, toasts, and overlays
 */
export interface UIState {
  /** Active modals */
  modals: {
    /** Modal ID */
    [modalId: string]: {
      /** Whether modal is open */
      isOpen: boolean;
      /** Modal data/props */
      data?: Record<string, unknown>;
      /** Modal size */
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    };
  };
  /** Toast notifications */
  toasts: Array<{
    /** Unique toast ID */
    id: string;
    /** Toast message */
    message: string;
    /** Toast type */
    type: 'success' | 'error' | 'warning' | 'info';
    /** Duration in milliseconds */
    duration?: number;
    /** Timestamp when created */
    createdAt: number;
  }>;
  /** Loading overlays */
  loadingOverlays: {
    /** Overlay ID */
    [overlayId: string]: {
      /** Whether overlay is visible */
      isVisible: boolean;
      /** Loading message */
      message?: string;
      /** Progress percentage (0-100) */
      progress?: number;
    };
  };
  /** Global loading state */
  isGlobalLoading: boolean;
  /** Sidebar state */
  sidebar: {
    /** Whether sidebar is open */
    isOpen: boolean;
    /** Whether sidebar is collapsed */
    isCollapsed: boolean;
    /** Currently active menu item */
    activeItem: string | null;
  };
  /** Theme preference */
  theme: 'light' | 'dark' | 'system';
}

// =====================
// NAVIGATION STATE
// =====================

/**
 * Navigation state slice
 * Tracks navigation history and breadcrumbs
 */
export interface NavigationState {
  /** Current route path */
  currentPath: string;
  /** Previous route path */
  previousPath: string | null;
  /** Breadcrumb trail */
  breadcrumbs: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
  /** Navigation history (last 10 routes) */
  history: string[];
  /** Whether can go back */
  canGoBack: boolean;
  /** Whether can go forward */
  canGoForward: boolean;
}

// =====================
// CACHE STATE
// =====================

/**
 * Cache state slice
 * Manages client-side caching and data freshness
 */
export interface CacheState {
  /** Cache entries by key */
  entries: Record<string, {
    /** Cached data */
    data: unknown;
    /** Timestamp when cached */
    timestamp: number;
    /** Time-to-live in milliseconds */
    ttl: number;
    /** Tags for cache invalidation */
    tags: string[];
  }>;
  /** Cache statistics */
  stats: {
    /** Total cache hits */
    hits: number;
    /** Total cache misses */
    misses: number;
    /** Cache hit rate */
    hitRate: number;
  };
}

// =====================
// ROOT STATE
// =====================

/**
 * Root Redux store state
 * Complete shape of the application store
 *
 * @example
 * ```typescript
 * const selector = (state: RootState) => state.incidentReports.entities;
 * ```
 */
export interface RootState {
  /** Authentication state */
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  /** Incident reports state */
  incidentReports: IncidentReportsState;
  /** Witness statements state */
  witnessStatements: WitnessStatementsState;
  /** Follow-up actions state */
  followUpActions: FollowUpActionsState;
  /** UI state */
  ui: UIState;
  /** Navigation state */
  navigation: NavigationState;
  /** Cache state */
  cache: CacheState;
}
