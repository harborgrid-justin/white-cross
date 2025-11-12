/**
 * WF-COMP-330 | navigation.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./index | Dependencies: ./index, lucide-react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Navigation Type Definitions
 *
 * Comprehensive type definitions for navigation items, breadcrumbs,
 * and navigation state management with permission integration.
 *
 * @module types/navigation
 */

// Import directly from source files to avoid circular dependency with index
import { UserRole } from './common';
import type { LucideIcon } from 'lucide-react';

// Note: PermissionResource and PermissionAction are defined in domain/accessControl.ts
// Using string types for now to avoid circular dependencies
type PermissionResource = string;
type PermissionAction = string;

// ============================================================================
// NAVIGATION ITEM TYPES
// ============================================================================

/**
 * Permission requirement for a navigation item
 */
export interface NavigationPermission {
  /** Resource being accessed */
  resource: PermissionResource | string;
  /** Action being performed */
  action: PermissionAction | string;
}

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display name for the navigation item */
  name: string;
  /** Route path */
  path: string;
  /** Icon name (from lucide-react) */
  icon: string;
  /** Roles allowed to access this item */
  roles?: UserRole[];
  /** Required permissions to access this item */
  permissions?: NavigationPermission[];
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Tooltip message when disabled */
  disabledMessage?: string;
  /** Child navigation items (for nested navigation) */
  children?: NavigationItem[];
  /** Whether this item should be hidden in navigation */
  hidden?: boolean;
  /** Badge content (e.g., notification count) */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** External link indicator */
  external?: boolean;
  /** Data attributes for testing */
  dataTestId?: string;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether this item requires special feature flag */
  featureFlag?: string;
  /** Sort order for display */
  order?: number;
  /** Section divider before this item */
  dividerBefore?: boolean;
  /** Section divider after this item */
  dividerAfter?: boolean;
  /** Section title for grouping */
  sectionTitle?: string;
}

/**
 * Navigation section grouping multiple items
 */
export interface NavigationSection {
  /** Section title */
  title: string;
  /** Section items */
  items: NavigationItem[];
  /** Whether section is collapsible */
  collapsible?: boolean;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Roles allowed to see this section */
  roles?: UserRole[];
}

/**
 * Filtered navigation item with accessibility info
 */
export interface FilteredNavigationItem extends NavigationItem {
  /** Whether user has access to this item */
  hasAccess: boolean;
  /** Reason for no access */
  noAccessReason?: 'role' | 'permission' | 'feature' | 'disabled';
  /** Whether this item is currently active */
  isActive?: boolean;
  /** Whether this item or its children are active */
  isActiveTree?: boolean;
}

// ============================================================================
// BREADCRUMB TYPES
// ============================================================================

/**
 * Breadcrumb item for navigation trail
 */
export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Route path */
  path?: string;
  /** Icon name (optional) */
  icon?: string;
  /** Whether this is the current/active item */
  isActive: boolean;
  /** Whether this item is clickable */
  isClickable?: boolean;
  /** Custom onClick handler */
  onClick?: () => void;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * Breadcrumb configuration
 */
export interface BreadcrumbConfig {
  /** Whether to show home icon */
  showHomeIcon?: boolean;
  /** Maximum items to display before truncation */
  maxItems?: number;
  /** Custom separator */
  separator?: string;
  /** Whether to show icons */
  showIcons?: boolean;
}

// ============================================================================
// NAVIGATION STATE TYPES
// ============================================================================

/**
 * Navigation history entry
 */
export interface NavigationHistoryEntry {
  /** Path visited */
  path: string;
  /** Page title */
  title?: string;
  /** Timestamp of visit */
  timestamp: number;
  /** State data */
  state?: any;
  /** Scroll position */
  scrollPosition?: {
    x: number;
    y: number;
  };
}

/**
 * Navigation context data
 */
export interface NavigationContext {
  /** Current path */
  currentPath: string;
  /** Previous path */
  previousPath: string | null;
  /** Navigation history */
  history: NavigationHistoryEntry[];
  /** Whether navigation is in progress */
  isNavigating: boolean;
  /** Whether user can go back */
  canGoBack: boolean;
  /** Whether user can go forward */
  canGoForward: boolean;
}

// ============================================================================
// QUICK ACCESS & SHORTCUTS
// ============================================================================

/**
 * Quick access item configuration
 */
export interface QuickAccessItem {
  /** Item ID */
  id: string;
  /** Display name */
  name: string;
  /** Target path */
  path: string;
  /** Icon */
  icon: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Description */
  description?: string;
  /** Required roles */
  roles?: UserRole[];
}

/**
 * Keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  /** Shortcut key combination */
  keys: string[];
  /** Action description */
  description: string;
  /** Handler function */
  handler: () => void;
  /** Whether shortcut is enabled */
  enabled?: boolean;
  /** Scope (global or specific component) */
  scope?: 'global' | 'navigation' | 'form' | 'modal';
}

// ============================================================================
// NAVIGATION MENU TYPES
// ============================================================================

/**
 * Context menu item
 */
export interface ContextMenuItem {
  /** Item ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon */
  icon?: string;
  /** Click handler */
  onClick: () => void;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Disabled reason/tooltip */
  disabledReason?: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Whether this is a dangerous action */
  danger?: boolean;
  /** Divider after this item */
  divider?: boolean;
  /** Required permissions */
  permissions?: NavigationPermission[];
}

/**
 * Action button configuration
 */
export interface NavigationAction {
  /** Action ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon */
  icon: string;
  /** Click handler */
  onClick: () => void;
  /** Variant */
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  /** Whether action is disabled */
  disabled?: boolean;
  /** Disabled reason/tooltip */
  disabledReason?: string;
  /** Loading state */
  loading?: boolean;
  /** Required permissions */
  permissions?: NavigationPermission[];
  /** Required roles */
  roles?: UserRole[];
  /** Keyboard shortcut */
  shortcut?: string;
  /** Confirmation message */
  confirmMessage?: string;
}

// ============================================================================
// MOBILE NAVIGATION TYPES
// ============================================================================

/**
 * Mobile navigation configuration
 */
export interface MobileNavigationConfig {
  /** Whether mobile menu is open */
  isOpen: boolean;
  /** Toggle handler */
  onToggle: (open: boolean) => void;
  /** Breakpoint for mobile view */
  breakpoint?: 'sm' | 'md' | 'lg';
  /** Position */
  position?: 'left' | 'right' | 'bottom';
  /** Whether to show overlay */
  showOverlay?: boolean;
}

/**
 * Bottom navigation item (for mobile)
 */
export interface BottomNavigationItem {
  /** Item ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon */
  icon: string;
  /** Target path */
  path: string;
  /** Badge count */
  badge?: number;
  /** Required roles */
  roles?: UserRole[];
}

// ============================================================================
// NAVIGATION GUARDS & INTERCEPTORS
// ============================================================================

/**
 * Navigation guard result
 */
export interface NavigationGuardResult {
  /** Whether navigation is allowed */
  allowed: boolean;
  /** Redirect path if navigation is denied */
  redirectTo?: string;
  /** Error message */
  error?: string;
  /** Additional data */
  data?: Record<string, any>;
}

/**
 * Unsaved changes state
 */
export interface UnsavedChangesState {
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
  /** Fields that have changed */
  changedFields?: string[];
  /** Show confirmation prompt */
  showPrompt: boolean;
  /** Pending navigation path */
  pendingNavigation: string | null;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Navigation item filter function
 */
export type NavigationItemFilter = (
  item: NavigationItem,
  userRole: UserRole | null
) => boolean;

/**
 * Navigation item transformer function
 */
export type NavigationItemTransformer = (
  item: NavigationItem
) => NavigationItem;

/**
 * Route matcher function
 */
export type RouteMatcher = (
  path: string,
  pattern: string
) => boolean;

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  LucideIcon,
};
