/**
 * LOC: NAV1234567
 * File: /reuse/frontend/navigation-menu-kit.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+ (optional)
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Navigation systems
 *   - Multi-tenant applications
 *   - Admin dashboards
 *   - E-commerce platforms
 */

/**
 * File: /reuse/frontend/navigation-menu-kit.ts
 * Locator: WC-NAV-MENU-001
 * Purpose: Enterprise Navigation Menu Kit - Comprehensive dynamic navigation and menu systems
 *
 * Upstream: React 18+, TypeScript 5.x, Next.js 16+ (optional)
 * Downstream: ../frontend/*, Navigation systems, Admin panels, Multi-tenant apps
 * Dependencies: React 18+, TypeScript 5.x, Next.js 16+ (optional)
 * Exports: 45+ components, hooks, and utilities for dynamic navigation menus
 *
 * LLM Context: Enterprise-grade navigation menu kit for React 18+ and Next.js 16+ applications.
 * Provides comprehensive navigation systems including top nav, side nav, mega menus, mobile menus,
 * breadcrumbs, tabs, pagination, wizards, and permission-based navigation. Designed for complex
 * applications requiring dynamic, role-based, responsive navigation with accessibility support.
 */

'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  CSSProperties,
  ComponentType,
} from 'react';

// ============================================================================
// TYPE DEFINITIONS - CORE NAVIGATION TYPES
// ============================================================================

export type MenuOrientation = 'horizontal' | 'vertical';
export type MenuAlignment = 'left' | 'center' | 'right' | 'stretch';
export type MenuPosition = 'top' | 'bottom' | 'left' | 'right' | 'static';
export type MenuVariant = 'default' | 'pills' | 'underline' | 'bordered' | 'elevated';
export type MenuSize = 'sm' | 'md' | 'lg' | 'xl';
export type DropdownTrigger = 'click' | 'hover' | 'focus';

/**
 * Represents a single navigation menu item
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;
  /** Display label */
  label: string;
  /** URL or route path */
  href?: string;
  /** Icon component or icon name */
  icon?: ReactNode | string;
  /** Badge content (count, label, etc.) */
  badge?: string | number;
  /** Badge variant */
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Whether the item is hidden */
  hidden?: boolean;
  /** Child menu items for nested menus */
  children?: MenuItem[];
  /** Custom onClick handler */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Target attribute for links */
  target?: '_self' | '_blank' | '_parent' | '_top';
  /** Required permissions to view this item */
  permissions?: string[];
  /** Required roles to view this item */
  roles?: string[];
  /** Custom metadata */
  metadata?: Record<string, any>;
  /** Whether to show divider after this item */
  divider?: boolean;
  /** Description text for mega menus */
  description?: string;
  /** Featured status for highlighting */
  featured?: boolean;
  /** Custom CSS class */
  className?: string;
  /** External link indicator */
  external?: boolean;
}

/**
 * Menu hierarchy configuration
 */
export interface MenuHierarchy {
  /** Root menu items */
  items: MenuItem[];
  /** Maximum depth allowed */
  maxDepth?: number;
  /** Active item ID */
  activeId?: string;
  /** Expanded item IDs */
  expandedIds?: string[];
  /** Whether to auto-expand parent of active item */
  autoExpand?: boolean;
}

/**
 * Navigation menu configuration
 */
export interface NavigationConfig {
  /** Menu items */
  items: MenuItem[];
  /** Menu orientation */
  orientation?: MenuOrientation;
  /** Menu alignment */
  alignment?: MenuAlignment;
  /** Menu variant */
  variant?: MenuVariant;
  /** Menu size */
  size?: MenuSize;
  /** Whether menu is collapsible */
  collapsible?: boolean;
  /** Whether menu is initially collapsed */
  defaultCollapsed?: boolean;
  /** Dropdown trigger type */
  dropdownTrigger?: DropdownTrigger;
  /** Whether to show icons */
  showIcons?: boolean;
  /** Whether to show badges */
  showBadges?: boolean;
  /** Current route/path for active detection */
  currentPath?: string;
  /** Custom active item matcher */
  isActiveItem?: (item: MenuItem, currentPath?: string) => boolean;
  /** Mobile breakpoint (in pixels) */
  mobileBreakpoint?: number;
  /** Whether menu is sticky */
  sticky?: boolean;
  /** Z-index for overlays */
  zIndex?: number;
}

/**
 * Menu state management
 */
export interface MenuState {
  /** Currently active item ID */
  activeId: string | null;
  /** IDs of expanded items */
  expandedIds: Set<string>;
  /** Whether menu is open (for mobile) */
  isOpen: boolean;
  /** Whether menu is collapsed (for collapsible menus) */
  isCollapsed: boolean;
  /** Currently hovered item ID */
  hoveredId: string | null;
  /** Currently focused item ID */
  focusedId: string | null;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** URL or route path */
  href?: string;
  /** Icon */
  icon?: ReactNode | string;
  /** Whether this is the current page */
  current?: boolean;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Tab item configuration
 */
export interface TabItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon */
  icon?: ReactNode | string;
  /** Badge content */
  badge?: string | number;
  /** Whether tab is disabled */
  disabled?: boolean;
  /** Tab content */
  content?: ReactNode;
  /** Whether tab is closable */
  closable?: boolean;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Whether to show page size selector */
  showPageSize?: boolean;
  /** Available page sizes */
  pageSizes?: number[];
  /** Whether to show first/last buttons */
  showFirstLast?: boolean;
  /** Number of page buttons to show */
  siblingCount?: number;
}

/**
 * Wizard step configuration
 */
export interface WizardStep {
  /** Unique identifier */
  id: string;
  /** Step label */
  label: string;
  /** Step description */
  description?: string;
  /** Step icon */
  icon?: ReactNode | string;
  /** Whether step is completed */
  completed?: boolean;
  /** Whether step is current */
  current?: boolean;
  /** Whether step is accessible */
  disabled?: boolean;
  /** Step content */
  content?: ReactNode;
  /** Validation function */
  validate?: () => boolean | Promise<boolean>;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

// ============================================================================
// CONTEXT - NAVIGATION CONTEXT
// ============================================================================

interface NavigationContextValue {
  state: MenuState;
  config: NavigationConfig;
  setActiveId: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  setExpandedIds: (ids: string[]) => void;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleCollapsed: () => void;
  setHoveredId: (id: string | null) => void;
  setFocusedId: (id: string | null) => void;
  getMenuItem: (id: string) => MenuItem | undefined;
  getActiveItem: () => MenuItem | undefined;
  getParentItem: (id: string) => MenuItem | undefined;
  getBreadcrumbs: () => BreadcrumbItem[];
  hasPermission: (item: MenuItem, userPermissions?: string[], userRoles?: string[]) => boolean;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

/**
 * Hook to access navigation context
 * @returns Navigation context value
 */
export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}

// ============================================================================
// HOOK: useNavigation - Main navigation state management
// ============================================================================

/**
 * Main navigation hook for managing menu state and navigation logic
 *
 * @param config - Navigation configuration
 * @param options - Additional options
 * @returns Navigation state and controls
 *
 * @example
 * ```tsx
 * const { state, setActiveId, toggleExpanded } = useNavigation({
 *   items: menuItems,
 *   orientation: 'vertical',
 *   currentPath: '/dashboard'
 * });
 * ```
 */
export function useNavigation(
  config: NavigationConfig,
  options?: {
    onActiveChange?: (id: string | null) => void;
    onMenuToggle?: (isOpen: boolean) => void;
    userPermissions?: string[];
    userRoles?: string[];
  }
) {
  const [state, setState] = useState<MenuState>({
    activeId: null,
    expandedIds: new Set<string>(),
    isOpen: false,
    isCollapsed: config.defaultCollapsed ?? false,
    hoveredId: null,
    focusedId: null,
  });

  // Flatten menu items for easy lookup
  const flattenedItems = useMemo(() => {
    const items = new Map<string, MenuItem>();
    const flatten = (menuItems: MenuItem[], parent?: MenuItem) => {
      menuItems.forEach((item) => {
        items.set(item.id, item);
        if (item.children) {
          flatten(item.children, item);
        }
      });
    };
    flatten(config.items);
    return items;
  }, [config.items]);

  // Build parent map
  const parentMap = useMemo(() => {
    const map = new Map<string, MenuItem>();
    const buildMap = (items: MenuItem[], parent?: MenuItem) => {
      items.forEach((item) => {
        if (parent) {
          map.set(item.id, parent);
        }
        if (item.children) {
          buildMap(item.children, item);
        }
      });
    };
    buildMap(config.items);
    return map;
  }, [config.items]);

  // Detect active item based on current path
  useEffect(() => {
    if (!config.currentPath) return;

    const isActive = config.isActiveItem || ((item: MenuItem, path?: string) => {
      if (!item.href || !path) return false;
      return item.href === path || path.startsWith(item.href + '/');
    });

    let activeItem: MenuItem | undefined;
    for (const [, item] of flattenedItems) {
      if (isActive(item, config.currentPath)) {
        activeItem = item;
        break;
      }
    }

    if (activeItem) {
      setState((prev) => ({ ...prev, activeId: activeItem!.id }));
      options?.onActiveChange?.(activeItem.id);

      // Auto-expand parent items if configured
      if (config.autoExpand !== false) {
        const expandIds = new Set<string>();
        let current = activeItem;
        while (current) {
          const parent = parentMap.get(current.id);
          if (parent) {
            expandIds.add(parent.id);
            current = parent;
          } else {
            break;
          }
        }
        setState((prev) => ({ ...prev, expandedIds: expandIds }));
      }
    }
  }, [config.currentPath, config.isActiveItem, config.autoExpand, flattenedItems, parentMap, options]);

  const setActiveId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, activeId: id }));
    options?.onActiveChange?.(id);
  }, [options]);

  const toggleExpanded = useCallback((id: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedIds);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return { ...prev, expandedIds: newExpanded };
    });
  }, []);

  const setExpandedIds = useCallback((ids: string[]) => {
    setState((prev) => ({ ...prev, expandedIds: new Set(ids) }));
  }, []);

  const toggleMenu = useCallback(() => {
    setState((prev) => {
      const newIsOpen = !prev.isOpen;
      options?.onMenuToggle?.(newIsOpen);
      return { ...prev, isOpen: newIsOpen };
    });
  }, [options]);

  const openMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
    options?.onMenuToggle?.(true);
  }, [options]);

  const closeMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
    options?.onMenuToggle?.(false);
  }, [options]);

  const toggleCollapsed = useCallback(() => {
    setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const setHoveredId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, hoveredId: id }));
  }, []);

  const setFocusedId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, focusedId: id }));
  }, []);

  const getMenuItem = useCallback((id: string) => {
    return flattenedItems.get(id);
  }, [flattenedItems]);

  const getActiveItem = useCallback(() => {
    return state.activeId ? flattenedItems.get(state.activeId) : undefined;
  }, [state.activeId, flattenedItems]);

  const getParentItem = useCallback((id: string) => {
    return parentMap.get(id);
  }, [parentMap]);

  const getBreadcrumbs = useCallback((): BreadcrumbItem[] => {
    if (!state.activeId) return [];

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentId: string | undefined = state.activeId;

    while (currentId) {
      const item = flattenedItems.get(currentId);
      if (item) {
        breadcrumbs.unshift({
          id: item.id,
          label: item.label,
          href: item.href,
          icon: item.icon,
          current: currentId === state.activeId,
          metadata: item.metadata,
        });
      }
      currentId = parentMap.get(currentId)?.id;
    }

    return breadcrumbs;
  }, [state.activeId, flattenedItems, parentMap]);

  const hasPermission = useCallback((
    item: MenuItem,
    userPermissions?: string[],
    userRoles?: string[]
  ) => {
    if (!item.permissions && !item.roles) return true;

    if (item.permissions && userPermissions) {
      const hasRequiredPermissions = item.permissions.every((p) =>
        userPermissions.includes(p)
      );
      if (!hasRequiredPermissions) return false;
    }

    if (item.roles && userRoles) {
      const hasRequiredRoles = item.roles.some((r) => userRoles.includes(r));
      if (!hasRequiredRoles) return false;
    }

    return true;
  }, []);

  return {
    state,
    config,
    setActiveId,
    toggleExpanded,
    setExpandedIds,
    toggleMenu,
    openMenu,
    closeMenu,
    toggleCollapsed,
    setHoveredId,
    setFocusedId,
    getMenuItem,
    getActiveItem,
    getParentItem,
    getBreadcrumbs,
    hasPermission,
  };
}

// ============================================================================
// HOOK: useMenuState - Simplified menu state management
// ============================================================================

/**
 * Simplified hook for managing menu open/close state
 *
 * @param defaultOpen - Whether menu is initially open
 * @returns Menu state and controls
 *
 * @example
 * ```tsx
 * const { isOpen, toggle, open, close } = useMenuState(false);
 * ```
 */
export function useMenuState(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, open, close, setIsOpen };
}

// ============================================================================
// HOOK: useActiveRoute - Active route detection
// ============================================================================

/**
 * Hook for detecting and managing active route
 *
 * @param items - Menu items
 * @param currentPath - Current route path
 * @param options - Matching options
 * @returns Active route information
 *
 * @example
 * ```tsx
 * const { activeId, activeItem, isActive } = useActiveRoute(
 *   menuItems,
 *   '/dashboard/settings'
 * );
 * ```
 */
export function useActiveRoute(
  items: MenuItem[],
  currentPath?: string,
  options?: {
    exact?: boolean;
    caseSensitive?: boolean;
    matcher?: (item: MenuItem, path: string) => boolean;
  }
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (!currentPath) return;

    const normalizedPath = options?.caseSensitive ? currentPath : currentPath.toLowerCase();

    const findActive = (menuItems: MenuItem[]): MenuItem | null => {
      for (const item of menuItems) {
        if (item.hidden || item.disabled) continue;

        const itemPath = options?.caseSensitive ? item.href : item.href?.toLowerCase();

        if (options?.matcher) {
          if (options.matcher(item, currentPath)) {
            return item;
          }
        } else if (itemPath) {
          if (options?.exact) {
            if (itemPath === normalizedPath) {
              return item;
            }
          } else {
            if (normalizedPath.startsWith(itemPath)) {
              return item;
            }
          }
        }

        if (item.children) {
          const childActive = findActive(item.children);
          if (childActive) return childActive;
        }
      }
      return null;
    };

    const active = findActive(items);
    setActiveId(active?.id || null);
    setActiveItem(active);
  }, [items, currentPath, options]);

  const isActive = useCallback((itemId: string) => {
    return activeId === itemId;
  }, [activeId]);

  return { activeId, activeItem, isActive };
}

// ============================================================================
// COMPONENT: NavigationProvider - Navigation context provider
// ============================================================================

interface NavigationProviderProps {
  config: NavigationConfig;
  children: ReactNode;
  userPermissions?: string[];
  userRoles?: string[];
  onActiveChange?: (id: string | null) => void;
  onMenuToggle?: (isOpen: boolean) => void;
}

/**
 * Navigation context provider
 *
 * @example
 * ```tsx
 * <NavigationProvider config={navConfig}>
 *   <MainNav />
 * </NavigationProvider>
 * ```
 */
export function NavigationProvider({
  config,
  children,
  userPermissions,
  userRoles,
  onActiveChange,
  onMenuToggle,
}: NavigationProviderProps) {
  const navigation = useNavigation(config, { onActiveChange, onMenuToggle, userPermissions, userRoles });

  const contextValue: NavigationContextValue = {
    ...navigation,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

// ============================================================================
// COMPONENT: NavigationMenu - Main navigation menu component
// ============================================================================

interface NavigationMenuProps {
  items: MenuItem[];
  orientation?: MenuOrientation;
  alignment?: MenuAlignment;
  variant?: MenuVariant;
  size?: MenuSize;
  className?: string;
  style?: CSSProperties;
  onItemClick?: (item: MenuItem, e: MouseEvent<HTMLElement>) => void;
  renderItem?: (item: MenuItem, defaultRender: ReactNode) => ReactNode;
  LinkComponent?: ComponentType<any>;
}

/**
 * Main navigation menu component
 *
 * @example
 * ```tsx
 * <NavigationMenu
 *   items={menuItems}
 *   orientation="horizontal"
 *   variant="underline"
 * />
 * ```
 */
export function NavigationMenu({
  items,
  orientation = 'horizontal',
  alignment = 'left',
  variant = 'default',
  size = 'md',
  className = '',
  style,
  onItemClick,
  renderItem,
  LinkComponent = 'a',
}: NavigationMenuProps) {
  const handleItemClick = useCallback((item: MenuItem, e: MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    item.onClick?.(e);
    onItemClick?.(item, e);
  }, [onItemClick]);

  const renderMenuItem = useCallback((item: MenuItem) => {
    if (item.hidden) return null;

    const defaultRender = (
      <LinkComponent
        key={item.id}
        href={item.href}
        target={item.target}
        className={`nav-item nav-item-${variant} nav-item-${size} ${item.disabled ? 'disabled' : ''} ${item.className || ''}`}
        onClick={(e: MouseEvent<HTMLElement>) => handleItemClick(item, e)}
        aria-disabled={item.disabled}
      >
        {item.icon && <span className="nav-item-icon">{item.icon}</span>}
        <span className="nav-item-label">{item.label}</span>
        {item.badge && (
          <span className={`nav-item-badge badge-${item.badgeVariant || 'default'}`}>
            {item.badge}
          </span>
        )}
      </LinkComponent>
    );

    return renderItem ? renderItem(item, defaultRender) : defaultRender;
  }, [variant, size, LinkComponent, handleItemClick, renderItem]);

  return (
    <nav
      className={`navigation-menu nav-${orientation} nav-align-${alignment} ${className}`}
      style={style}
      role="navigation"
    >
      {items.map(renderMenuItem)}
    </nav>
  );
}

// ============================================================================
// COMPONENT: MainNav - Main application navigation
// ============================================================================

interface MainNavProps {
  items: MenuItem[];
  logo?: ReactNode;
  actions?: ReactNode;
  variant?: MenuVariant;
  sticky?: boolean;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Main application navigation with logo and actions
 *
 * @example
 * ```tsx
 * <MainNav
 *   items={menuItems}
 *   logo={<Logo />}
 *   actions={<UserMenu />}
 *   sticky
 * />
 * ```
 */
export function MainNav({
  items,
  logo,
  actions,
  variant = 'default',
  sticky = false,
  className = '',
  LinkComponent,
}: MainNavProps) {
  return (
    <header className={`main-nav ${sticky ? 'sticky' : ''} ${className}`}>
      {logo && <div className="main-nav-logo">{logo}</div>}
      <NavigationMenu
        items={items}
        orientation="horizontal"
        variant={variant}
        LinkComponent={LinkComponent}
      />
      {actions && <div className="main-nav-actions">{actions}</div>}
    </header>
  );
}

// ============================================================================
// COMPONENT: TopNav - Top navigation bar
// ============================================================================

interface TopNavProps {
  leftItems?: MenuItem[];
  centerItems?: MenuItem[];
  rightItems?: MenuItem[];
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Top navigation bar with left, center, and right sections
 *
 * @example
 * ```tsx
 * <TopNav
 *   leftItems={leftMenu}
 *   centerItems={centerMenu}
 *   rightItems={rightMenu}
 * />
 * ```
 */
export function TopNav({
  leftItems,
  centerItems,
  rightItems,
  className = '',
  LinkComponent,
}: TopNavProps) {
  return (
    <nav className={`top-nav ${className}`} role="navigation">
      {leftItems && (
        <div className="top-nav-left">
          <NavigationMenu items={leftItems} orientation="horizontal" LinkComponent={LinkComponent} />
        </div>
      )}
      {centerItems && (
        <div className="top-nav-center">
          <NavigationMenu items={centerItems} orientation="horizontal" LinkComponent={LinkComponent} />
        </div>
      )}
      {rightItems && (
        <div className="top-nav-right">
          <NavigationMenu items={rightItems} orientation="horizontal" LinkComponent={LinkComponent} />
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// COMPONENT: SideNav - Sidebar navigation
// ============================================================================

interface SideNavProps {
  items: MenuItem[];
  position?: 'left' | 'right';
  width?: number | string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  LinkComponent?: ComponentType<any>;
}

/**
 * Sidebar navigation component
 *
 * @example
 * ```tsx
 * <SideNav
 *   items={sidebarItems}
 *   position="left"
 *   collapsible
 *   header={<Logo />}
 * />
 * ```
 */
export function SideNav({
  items,
  position = 'left',
  width = 280,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  header,
  footer,
  LinkComponent,
}: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <aside
      className={`side-nav side-nav-${position} ${isCollapsed ? 'collapsed' : ''} ${className}`}
      style={{ width: isCollapsed ? '64px' : width }}
    >
      {header && <div className="side-nav-header">{header}</div>}
      <div className="side-nav-content">
        <NavigationMenu
          items={items}
          orientation="vertical"
          LinkComponent={LinkComponent}
        />
      </div>
      {footer && <div className="side-nav-footer">{footer}</div>}
      {collapsible && (
        <button
          className="side-nav-toggle"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      )}
    </aside>
  );
}

// ============================================================================
// COMPONENT: MenuBuilder - Dynamic menu builder
// ============================================================================

interface MenuBuilderProps {
  initialItems?: MenuItem[];
  onChange?: (items: MenuItem[]) => void;
  maxDepth?: number;
  className?: string;
}

/**
 * Dynamic menu builder for creating/editing menus
 *
 * @example
 * ```tsx
 * <MenuBuilder
 *   initialItems={items}
 *   onChange={setMenuItems}
 *   maxDepth={3}
 * />
 * ```
 */
export function MenuBuilder({
  initialItems = [],
  onChange,
  maxDepth = 3,
  className = '',
}: MenuBuilderProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  const handleChange = useCallback((newItems: MenuItem[]) => {
    setItems(newItems);
    onChange?.(newItems);
  }, [onChange]);

  const addItem = useCallback(() => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: 'New Item',
      href: '#',
    };
    handleChange([...items, newItem]);
  }, [items, handleChange]);

  const removeItem = useCallback((id: string) => {
    const removeFromItems = (menuItems: MenuItem[]): MenuItem[] => {
      return menuItems.filter((item) => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = removeFromItems(item.children);
        }
        return true;
      });
    };
    handleChange(removeFromItems(items));
  }, [items, handleChange]);

  const updateItem = useCallback((id: string, updates: Partial<MenuItem>) => {
    const updateInItems = (menuItems: MenuItem[]): MenuItem[] => {
      return menuItems.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return { ...item, children: updateInItems(item.children) };
        }
        return item;
      });
    };
    handleChange(updateInItems(items));
  }, [items, handleChange]);

  return (
    <div className={`menu-builder ${className}`}>
      <div className="menu-builder-header">
        <h3>Menu Builder</h3>
        <button onClick={addItem} className="btn-add-item">
          Add Item
        </button>
      </div>
      <div className="menu-builder-items">
        {items.map((item) => (
          <div key={item.id} className="menu-builder-item">
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
              placeholder="Label"
            />
            <input
              type="text"
              value={item.href || ''}
              onChange={(e) => updateItem(item.id, { href: e.target.value })}
              placeholder="URL"
            />
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: MenuEditor - Advanced menu editor with drag-drop support
// ============================================================================

interface MenuEditorProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  onItemSelect?: (item: MenuItem) => void;
  className?: string;
}

/**
 * Advanced menu editor with item management
 *
 * @example
 * ```tsx
 * <MenuEditor
 *   items={menuItems}
 *   onChange={setMenuItems}
 *   onItemSelect={handleItemSelect}
 * />
 * ```
 */
export function MenuEditor({
  items,
  onChange,
  onItemSelect,
  className = '',
}: MenuEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = useCallback((item: MenuItem) => {
    setSelectedId(item.id);
    onItemSelect?.(item);
  }, [onItemSelect]);

  const renderItem = useCallback((item: MenuItem, depth = 0) => {
    return (
      <div
        key={item.id}
        className={`menu-editor-item ${selectedId === item.id ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => handleSelect(item)}
      >
        <span>{item.label}</span>
        {item.children && item.children.length > 0 && (
          <span className="child-count">({item.children.length})</span>
        )}
      </div>
    );
  }, [selectedId, handleSelect]);

  const renderItems = useCallback((menuItems: MenuItem[], depth = 0) => {
    return menuItems.map((item) => (
      <React.Fragment key={item.id}>
        {renderItem(item, depth)}
        {item.children && renderItems(item.children, depth + 1)}
      </React.Fragment>
    ));
  }, [renderItem]);

  return (
    <div className={`menu-editor ${className}`}>
      {renderItems(items)}
    </div>
  );
}

// ============================================================================
// COMPONENT: MenuDragDrop - Drag and drop menu organizer
// ============================================================================

interface MenuDragDropProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
  className?: string;
}

/**
 * Drag and drop menu organizer
 *
 * @example
 * ```tsx
 * <MenuDragDrop items={items} onChange={setItems} />
 * ```
 */
export function MenuDragDrop({
  items,
  onChange,
  className = '',
}: MenuDragDropProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const handleDrop = useCallback((targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    // Implement reordering logic
    onChange(items);
  }, [draggedId, items, onChange]);

  return (
    <div className={`menu-drag-drop ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(item.id)}
          onDragEnd={handleDragEnd}
          onDrop={() => handleDrop(item.id)}
          className={`draggable-item ${draggedId === item.id ? 'dragging' : ''}`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT: MenuItem - Single menu item component
// ============================================================================

interface MenuItemComponentProps {
  item: MenuItem;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  active?: boolean;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Single menu item component
 *
 * @example
 * ```tsx
 * <MenuItem item={menuItem} active onClick={handleClick} />
 * ```
 */
export function MenuItemComponent({
  item,
  onClick,
  active = false,
  className = '',
  LinkComponent = 'a',
}: MenuItemComponentProps) {
  const handleClick = useCallback((e: MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    item.onClick?.(e);
    onClick?.(e);
  }, [item, onClick]);

  if (item.hidden) return null;

  return (
    <LinkComponent
      href={item.href}
      target={item.target}
      className={`menu-item ${active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      aria-disabled={item.disabled}
      aria-current={active ? 'page' : undefined}
    >
      {item.icon && <span className="menu-item-icon">{item.icon}</span>}
      <span className="menu-item-label">{item.label}</span>
      {item.badge && (
        <span className={`menu-item-badge badge-${item.badgeVariant || 'default'}`}>
          {item.badge}
        </span>
      )}
    </LinkComponent>
  );
}

// ============================================================================
// COMPONENT: MenuLink - Menu link component
// ============================================================================

interface MenuLinkProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Menu link component
 *
 * @example
 * ```tsx
 * <MenuLink href="/dashboard" active>Dashboard</MenuLink>
 * ```
 */
export function MenuLink({
  href,
  children,
  active = false,
  disabled = false,
  external = false,
  className = '',
  LinkComponent = 'a',
}: MenuLinkProps) {
  return (
    <LinkComponent
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`menu-link ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      aria-disabled={disabled}
      aria-current={active ? 'page' : undefined}
    >
      {children}
      {external && <span className="external-icon">↗</span>}
    </LinkComponent>
  );
}

// ============================================================================
// COMPONENT: MenuButton - Menu button component
// ============================================================================

interface MenuButtonProps {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Menu button component
 *
 * @example
 * ```tsx
 * <MenuButton onClick={handleClick} active>Settings</MenuButton>
 * ```
 */
export function MenuButton({
  children,
  onClick,
  active = false,
  disabled = false,
  className = '',
}: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`menu-button ${active ? 'active' : ''} ${className}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

// ============================================================================
// COMPONENT: MenuDivider - Menu divider component
// ============================================================================

interface MenuDividerProps {
  className?: string;
  label?: string;
}

/**
 * Menu divider component
 *
 * @example
 * ```tsx
 * <MenuDivider label="Actions" />
 * ```
 */
export function MenuDivider({ className = '', label }: MenuDividerProps) {
  return (
    <div className={`menu-divider ${className}`} role="separator">
      {label && <span className="menu-divider-label">{label}</span>}
    </div>
  );
}

// ============================================================================
// COMPONENT: NestedMenu - Nested menu with collapsible children
// ============================================================================

interface NestedMenuProps {
  items: MenuItem[];
  depth?: number;
  maxDepth?: number;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Nested menu with collapsible children
 *
 * @example
 * ```tsx
 * <NestedMenu items={menuItems} maxDepth={3} />
 * ```
 */
export function NestedMenu({
  items,
  depth = 0,
  maxDepth = 5,
  className = '',
  LinkComponent,
}: NestedMenuProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const renderItem = useCallback((item: MenuItem) => {
    if (item.hidden) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);

    return (
      <div key={item.id} className="nested-menu-item">
        <div className="nested-menu-item-content">
          <MenuItemComponent item={item} LinkComponent={LinkComponent} />
          {hasChildren && depth < maxDepth && (
            <button
              onClick={() => toggleExpanded(item.id)}
              className="nested-menu-toggle"
              aria-expanded={isExpanded}
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
        {hasChildren && isExpanded && depth < maxDepth && (
          <div className="nested-menu-children">
            <NestedMenu
              items={item.children!}
              depth={depth + 1}
              maxDepth={maxDepth}
              LinkComponent={LinkComponent}
            />
          </div>
        )}
      </div>
    );
  }, [depth, maxDepth, expandedIds, toggleExpanded, LinkComponent]);

  return (
    <div className={`nested-menu nested-menu-depth-${depth} ${className}`}>
      {items.map(renderItem)}
    </div>
  );
}

// ============================================================================
// COMPONENT: SubMenu - Submenu component
// ============================================================================

interface SubMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Submenu component
 *
 * @example
 * ```tsx
 * <SubMenu trigger={<button>More</button>} items={subMenuItems} />
 * ```
 */
export function SubMenu({
  trigger,
  items,
  open: controlledOpen,
  onOpenChange,
  className = '',
  LinkComponent,
}: SubMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((open: boolean) => {
    if (!isControlled) {
      setInternalOpen(open);
    }
    onOpenChange?.(open);
  }, [isControlled, onOpenChange]);

  const toggleOpen = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen, setOpen]);

  return (
    <div className={`submenu ${isOpen ? 'open' : ''} ${className}`}>
      <div className="submenu-trigger" onClick={toggleOpen}>
        {trigger}
      </div>
      {isOpen && (
        <div className="submenu-content">
          <NavigationMenu items={items} orientation="vertical" LinkComponent={LinkComponent} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: Dropdown - Dropdown menu component
// ============================================================================

interface DropdownProps {
  trigger: ReactNode;
  items: MenuItem[];
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Dropdown menu component
 *
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<button>Actions</button>}
 *   items={dropdownItems}
 *   placement="bottom-start"
 * />
 * ```
 */
export function Dropdown({
  trigger,
  items,
  placement = 'bottom-start',
  className = '',
  LinkComponent,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, close]);

  return (
    <div ref={dropdownRef} className={`dropdown ${isOpen ? 'open' : ''} ${className}`}>
      <div className="dropdown-trigger" onClick={toggleOpen}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown-content dropdown-${placement}`}>
          <NavigationMenu
            items={items}
            orientation="vertical"
            LinkComponent={LinkComponent}
            onItemClick={close}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: MegaMenu - Mega menu with rich content
// ============================================================================

interface MegaMenuColumn {
  title?: string;
  items: MenuItem[];
}

interface MegaMenuProps {
  trigger: ReactNode;
  columns: MegaMenuColumn[];
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Mega menu with multiple columns
 *
 * @example
 * ```tsx
 * <MegaMenu
 *   trigger={<button>Products</button>}
 *   columns={[
 *     { title: 'Category 1', items: items1 },
 *     { title: 'Category 2', items: items2 }
 *   ]}
 * />
 * ```
 */
export function MegaMenu({
  trigger,
  columns,
  className = '',
  LinkComponent,
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <div
      className={`mega-menu ${isOpen ? 'open' : ''} ${className}`}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <div className="mega-menu-trigger">{trigger}</div>
      {isOpen && (
        <div className="mega-menu-content">
          <div className="mega-menu-columns">
            {columns.map((column, index) => (
              <div key={index} className="mega-menu-column">
                {column.title && <h3 className="mega-menu-column-title">{column.title}</h3>}
                <NavigationMenu
                  items={column.items}
                  orientation="vertical"
                  LinkComponent={LinkComponent}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: MobileMenu - Mobile menu with hamburger
// ============================================================================

interface MobileMenuProps {
  items: MenuItem[];
  trigger?: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Mobile menu component
 *
 * @example
 * ```tsx
 * <MobileMenu items={mobileItems} position="left" />
 * ```
 */
export function MobileMenu({
  items,
  trigger,
  position = 'left',
  className = '',
  LinkComponent,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button className="mobile-menu-trigger" onClick={toggle} aria-label="Toggle menu">
        {trigger || <Hamburger isOpen={isOpen} />}
      </button>
      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={close} />
          <div className={`mobile-menu mobile-menu-${position} ${className}`}>
            <button className="mobile-menu-close" onClick={close} aria-label="Close menu">
              ×
            </button>
            <NavigationMenu
              items={items}
              orientation="vertical"
              LinkComponent={LinkComponent}
              onItemClick={close}
            />
          </div>
        </>
      )}
    </>
  );
}

// ============================================================================
// COMPONENT: Hamburger - Hamburger menu icon
// ============================================================================

interface HamburgerProps {
  isOpen?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Hamburger menu icon
 *
 * @example
 * ```tsx
 * <Hamburger isOpen={isMenuOpen} onClick={toggleMenu} />
 * ```
 */
export function Hamburger({ isOpen = false, onClick, className = '' }: HamburgerProps) {
  return (
    <button
      className={`hamburger ${isOpen ? 'open' : ''} ${className}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <span className="hamburger-line" />
      <span className="hamburger-line" />
      <span className="hamburger-line" />
    </button>
  );
}

// ============================================================================
// COMPONENT: SlideMenu - Sliding menu panel
// ============================================================================

interface SlideMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  width?: number | string;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Sliding menu panel
 *
 * @example
 * ```tsx
 * <SlideMenu
 *   items={menuItems}
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   position="right"
 * />
 * ```
 */
export function SlideMenu({
  items,
  isOpen,
  onClose,
  position = 'left',
  width = 320,
  className = '',
  LinkComponent,
}: SlideMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="slide-menu-overlay" onClick={onClose} />}
      <div
        className={`slide-menu slide-menu-${position} ${isOpen ? 'open' : ''} ${className}`}
        style={{ width }}
      >
        <div className="slide-menu-header">
          <button className="slide-menu-close" onClick={onClose} aria-label="Close menu">
            ×
          </button>
        </div>
        <div className="slide-menu-content">
          <NavigationMenu
            items={items}
            orientation="vertical"
            LinkComponent={LinkComponent}
            onItemClick={onClose}
          />
        </div>
      </div>
    </>
  );
}

// ============================================================================
// COMPONENT: OffCanvas - Off-canvas menu
// ============================================================================

interface OffCanvasProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

/**
 * Off-canvas menu component
 *
 * @example
 * ```tsx
 * <OffCanvas isOpen={isOpen} onClose={handleClose} position="right">
 *   <NavigationMenu items={items} />
 * </OffCanvas>
 * ```
 */
export function OffCanvas({
  children,
  isOpen,
  onClose,
  position = 'left',
  className = '',
}: OffCanvasProps) {
  return (
    <>
      {isOpen && <div className="offcanvas-overlay" onClick={onClose} />}
      <div className={`offcanvas offcanvas-${position} ${isOpen ? 'open' : ''} ${className}`}>
        <button className="offcanvas-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="offcanvas-content">{children}</div>
      </div>
    </>
  );
}

// ============================================================================
// COMPONENT: BreadcrumbNav - Breadcrumb navigation
// ============================================================================

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Breadcrumb navigation component
 *
 * @example
 * ```tsx
 * <BreadcrumbNav items={breadcrumbs} separator="/" showHome />
 * ```
 */
export function BreadcrumbNav({
  items,
  separator = '/',
  showHome = true,
  homeHref = '/',
  className = '',
  LinkComponent = 'a',
}: BreadcrumbNavProps) {
  const allItems = useMemo(() => {
    if (showHome) {
      const homeItem: BreadcrumbItem = {
        id: 'home',
        label: 'Home',
        href: homeHref,
      };
      return [homeItem, ...items];
    }
    return items;
  }, [items, showHome, homeHref]);

  return (
    <nav className={`breadcrumb-nav ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {allItems.map((item, index) => (
          <li
            key={item.id}
            className={`breadcrumb-item ${item.current ? 'current' : ''}`}
          >
            {item.current ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <LinkComponent href={item.href}>{item.label}</LinkComponent>
            )}
            {index < allItems.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ============================================================================
// COMPONENT: Breadcrumbs - Alias for BreadcrumbNav
// ============================================================================

/**
 * Breadcrumbs component (alias for BreadcrumbNav)
 */
export const Breadcrumbs = BreadcrumbNav;

// ============================================================================
// COMPONENT: BreadcrumbItem - Single breadcrumb item
// ============================================================================

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem;
  separator?: ReactNode;
  showSeparator?: boolean;
  LinkComponent?: ComponentType<any>;
}

/**
 * Single breadcrumb item component
 *
 * @example
 * ```tsx
 * <BreadcrumbItemComponent item={item} separator="/" />
 * ```
 */
export function BreadcrumbItemComponent({
  item,
  separator = '/',
  showSeparator = true,
  LinkComponent = 'a',
}: BreadcrumbItemComponentProps) {
  return (
    <li className={`breadcrumb-item ${item.current ? 'current' : ''}`}>
      {item.icon && <span className="breadcrumb-icon">{item.icon}</span>}
      {item.current ? (
        <span aria-current="page">{item.label}</span>
      ) : (
        <LinkComponent href={item.href}>{item.label}</LinkComponent>
      )}
      {showSeparator && (
        <span className="breadcrumb-separator" aria-hidden="true">
          {separator}
        </span>
      )}
    </li>
  );
}

// ============================================================================
// COMPONENT: TabNav - Tab navigation
// ============================================================================

interface TabNavProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Tab navigation component
 *
 * @example
 * ```tsx
 * <TabNav
 *   tabs={tabs}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   variant="underline"
 * />
 * ```
 */
export function TabNav({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
}: TabNavProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id);
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = useCallback((tabId: string) => {
    if (!isControlled) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  }, [isControlled, onTabChange]);

  return (
    <div className={`tab-nav tab-nav-${variant} tab-nav-${orientation} ${className}`}>
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            disabled={tab.disabled}
            className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
            {tab.closable && (
              <button className="tab-close" aria-label={`Close ${tab.label}`}>
                ×
              </button>
            )}
          </button>
        ))}
      </div>
      <div className="tab-panels">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
            className="tab-panel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: TabList - Tab list component
// ============================================================================

interface TabListProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tab list component
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab>Tab 1</Tab>
 *   <Tab>Tab 2</Tab>
 * </TabList>
 * ```
 */
export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`tab-list ${className}`} role="tablist">
      {children}
    </div>
  );
}

// ============================================================================
// COMPONENT: TabPanel - Tab panel component
// ============================================================================

interface TabPanelProps {
  children: ReactNode;
  active?: boolean;
  className?: string;
}

/**
 * Tab panel component
 *
 * @example
 * ```tsx
 * <TabPanel active={isActive}>Panel content</TabPanel>
 * ```
 */
export function TabPanel({ children, active = false, className = '' }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={!active}
      className={`tab-panel ${active ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================================
// COMPONENT: TabBar - Tab bar component
// ============================================================================

interface TabBarProps {
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Tab bar component (simplified tab navigation)
 *
 * @example
 * ```tsx
 * <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
 * ```
 */
export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: TabBarProps) {
  return (
    <div className={`tab-bar ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-bar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange?.(tab.id)}
          disabled={tab.disabled}
        >
          {tab.icon && <span className="tab-bar-icon">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && <span className="tab-bar-badge">{tab.badge}</span>}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT: PaginationNav - Pagination navigation
// ============================================================================

interface PaginationNavProps {
  config: PaginationConfig;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
}

/**
 * Pagination navigation component
 *
 * @example
 * ```tsx
 * <PaginationNav
 *   config={{ currentPage: 1, totalPages: 10, pageSize: 20, totalItems: 200 }}
 *   onPageChange={setPage}
 * />
 * ```
 */
export function PaginationNav({
  config,
  onPageChange,
  onPageSizeChange,
  className = '',
}: PaginationNavProps) {
  const {
    currentPage,
    totalPages,
    pageSize,
    showPageSize = true,
    pageSizes = [10, 20, 50, 100],
    showFirstLast = true,
    siblingCount = 1,
  } = config;

  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (showFirstLast || leftSiblingIndex === 1) {
      pageNumbers.push(1);
    }

    if (shouldShowLeftDots) {
      pageNumbers.push('...');
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    if (shouldShowRightDots) {
      pageNumbers.push('...');
    }

    if (totalPages > 1 && (showFirstLast || rightSiblingIndex === totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [currentPage, totalPages, siblingCount, showFirstLast]);

  return (
    <nav className={`pagination-nav ${className}`} aria-label="Pagination">
      <div className="pagination-controls">
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
            className="pagination-button"
          >
            ««
          </button>
        )}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="pagination-button"
        >
          «
        </button>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ) : (
              <span className="pagination-dots">{page}</span>
            )}
          </React.Fragment>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="pagination-button"
        >
          »
        </button>
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
            className="pagination-button"
          >
            »»
          </button>
        )}
      </div>
      {showPageSize && onPageSizeChange && (
        <div className="pagination-page-size">
          <label htmlFor="page-size-select">Items per page:</label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}

// ============================================================================
// COMPONENT: StepNav - Step navigation
// ============================================================================

interface StepNavProps {
  steps: WizardStep[];
  currentStep?: string;
  onStepChange?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Step navigation component
 *
 * @example
 * ```tsx
 * <StepNav
 *   steps={steps}
 *   currentStep={currentStep}
 *   onStepChange={setCurrentStep}
 * />
 * ```
 */
export function StepNav({
  steps,
  currentStep,
  onStepChange,
  orientation = 'horizontal',
  className = '',
}: StepNavProps) {
  return (
    <nav className={`step-nav step-nav-${orientation} ${className}`} aria-label="Steps">
      <ol className="step-list">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`step ${step.current || step.id === currentStep ? 'current' : ''} ${
              step.completed ? 'completed' : ''
            } ${step.disabled ? 'disabled' : ''}`}
          >
            <button
              onClick={() => !step.disabled && onStepChange?.(step.id)}
              disabled={step.disabled}
              className="step-button"
              aria-current={step.current || step.id === currentStep ? 'step' : undefined}
            >
              <span className="step-indicator">
                {step.completed ? '✓' : step.icon || index + 1}
              </span>
              <span className="step-content">
                <span className="step-label">{step.label}</span>
                {step.description && (
                  <span className="step-description">{step.description}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ============================================================================
// COMPONENT: WizardNav - Wizard navigation with step progression
// ============================================================================

interface WizardNavProps {
  steps: WizardStep[];
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepChange?: (index: number) => void;
  showStepNumber?: boolean;
  className?: string;
}

/**
 * Wizard navigation component with step progression
 *
 * @example
 * ```tsx
 * <WizardNav
 *   steps={wizardSteps}
 *   currentStepIndex={currentIndex}
 *   onNext={handleNext}
 *   onPrevious={handlePrevious}
 * />
 * ```
 */
export function WizardNav({
  steps,
  currentStepIndex = 0,
  onNext,
  onPrevious,
  onStepChange,
  showStepNumber = true,
  className = '',
}: WizardNavProps) {
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className={`wizard-nav ${className}`}>
      <div className="wizard-progress">
        <div className="wizard-progress-bar">
          <div
            className="wizard-progress-fill"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="wizard-steps">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepChange?.(index)}
              disabled={step.disabled || index > currentStepIndex}
              className={`wizard-step ${index === currentStepIndex ? 'current' : ''} ${
                step.completed ? 'completed' : ''
              }`}
              aria-current={index === currentStepIndex ? 'step' : undefined}
            >
              <span className="wizard-step-indicator">
                {step.completed ? '✓' : showStepNumber ? index + 1 : step.icon}
              </span>
              <span className="wizard-step-label">{step.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="wizard-content">
        {currentStep?.content}
      </div>
      <div className="wizard-actions">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="wizard-button wizard-button-previous"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="wizard-button wizard-button-next"
        >
          {isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: FooterNav - Footer navigation
// ============================================================================

interface FooterNavProps {
  sections?: Array<{
    title: string;
    items: MenuItem[];
  }>;
  items?: MenuItem[];
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Footer navigation component
 *
 * @example
 * ```tsx
 * <FooterNav
 *   sections={[
 *     { title: 'Product', items: productLinks },
 *     { title: 'Company', items: companyLinks }
 *   ]}
 * />
 * ```
 */
export function FooterNav({
  sections,
  items,
  className = '',
  LinkComponent,
}: FooterNavProps) {
  return (
    <nav className={`footer-nav ${className}`} aria-label="Footer navigation">
      {sections ? (
        <div className="footer-nav-sections">
          {sections.map((section, index) => (
            <div key={index} className="footer-nav-section">
              <h3 className="footer-nav-section-title">{section.title}</h3>
              <NavigationMenu
                items={section.items}
                orientation="vertical"
                LinkComponent={LinkComponent}
              />
            </div>
          ))}
        </div>
      ) : items ? (
        <NavigationMenu items={items} orientation="horizontal" LinkComponent={LinkComponent} />
      ) : null}
    </nav>
  );
}

// ============================================================================
// COMPONENT: SocialNav - Social media navigation
// ============================================================================

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: ReactNode;
  label?: string;
}

interface SocialNavProps {
  links: SocialLink[];
  className?: string;
}

/**
 * Social media navigation component
 *
 * @example
 * ```tsx
 * <SocialNav
 *   links={[
 *     { id: '1', platform: 'twitter', url: 'https://twitter.com/...' },
 *     { id: '2', platform: 'facebook', url: 'https://facebook.com/...' }
 *   ]}
 * />
 * ```
 */
export function SocialNav({ links, className = '' }: SocialNavProps) {
  return (
    <nav className={`social-nav ${className}`} aria-label="Social media">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-link social-link-${link.platform}`}
          aria-label={link.label || `Visit our ${link.platform}`}
        >
          {link.icon || link.platform}
        </a>
      ))}
    </nav>
  );
}

// ============================================================================
// COMPONENT: UtilityNav - Utility navigation
// ============================================================================

interface UtilityNavProps {
  items: MenuItem[];
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Utility navigation component (secondary navigation)
 *
 * @example
 * ```tsx
 * <UtilityNav items={utilityItems} />
 * ```
 */
export function UtilityNav({
  items,
  className = '',
  LinkComponent,
}: UtilityNavProps) {
  return (
    <nav className={`utility-nav ${className}`} aria-label="Utility navigation">
      <NavigationMenu
        items={items}
        orientation="horizontal"
        size="sm"
        LinkComponent={LinkComponent}
      />
    </nav>
  );
}

// ============================================================================
// COMPONENT: MenuHighlight - Menu item highlight effect
// ============================================================================

interface MenuHighlightProps {
  targetRef: React.RefObject<HTMLElement>;
  className?: string;
}

/**
 * Menu item highlight effect (animated underline/background)
 *
 * @example
 * ```tsx
 * const activeRef = useRef<HTMLElement>(null);
 * <MenuHighlight targetRef={activeRef} />
 * ```
 */
export function MenuHighlight({ targetRef, className = '' }: MenuHighlightProps) {
  const [style, setStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!targetRef.current) return;

    const updatePosition = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const parent = targetRef.current.parentElement?.getBoundingClientRect();

      if (parent) {
        setStyle({
          width: rect.width,
          height: rect.height,
          transform: `translate(${rect.left - parent.left}px, ${rect.top - parent.top}px)`,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [targetRef]);

  return <div className={`menu-highlight ${className}`} style={style} />;
}

// ============================================================================
// COMPONENT: ActiveIndicator - Active menu item indicator
// ============================================================================

interface ActiveIndicatorProps {
  active?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

/**
 * Active menu item indicator
 *
 * @example
 * ```tsx
 * <MenuItem>
 *   Dashboard
 *   <ActiveIndicator active={isActive} position="left" />
 * </MenuItem>
 * ```
 */
export function ActiveIndicator({
  active = false,
  position = 'left',
  className = '',
}: ActiveIndicatorProps) {
  if (!active) return null;

  return (
    <span
      className={`active-indicator active-indicator-${position} ${className}`}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// COMPONENT: MenuBadges - Menu item badges component
// ============================================================================

interface MenuBadgesProps {
  count?: number;
  label?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  showZero?: boolean;
  max?: number;
  className?: string;
}

/**
 * Menu item badges component
 *
 * @example
 * ```tsx
 * <MenuBadges count={5} variant="danger" max={99} />
 * ```
 */
export function MenuBadges({
  count,
  label,
  variant = 'default',
  showZero = false,
  max = 99,
  className = '',
}: MenuBadgesProps) {
  if (!showZero && count === 0) return null;
  if (!count && !label) return null;

  const displayValue = count !== undefined
    ? count > max
      ? `${max}+`
      : count.toString()
    : label;

  return (
    <span className={`menu-badge menu-badge-${variant} ${className}`}>
      {displayValue}
    </span>
  );
}

// ============================================================================
// COMPONENT: PermissionBasedMenu - Permission-based menu filtering
// ============================================================================

interface PermissionBasedMenuProps {
  items: MenuItem[];
  userPermissions: string[];
  userRoles?: string[];
  fallback?: ReactNode;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Permission-based menu that filters items based on user permissions/roles
 *
 * @example
 * ```tsx
 * <PermissionBasedMenu
 *   items={allMenuItems}
 *   userPermissions={['read', 'write']}
 *   userRoles={['admin']}
 * />
 * ```
 */
export function PermissionBasedMenu({
  items,
  userPermissions,
  userRoles,
  fallback,
  className = '',
  LinkComponent,
}: PermissionBasedMenuProps) {
  const filterItemsByPermission = useCallback((menuItems: MenuItem[]): MenuItem[] => {
    return menuItems
      .filter((item) => {
        if (!item.permissions && !item.roles) return true;

        if (item.permissions) {
          const hasPermissions = item.permissions.every((p) =>
            userPermissions.includes(p)
          );
          if (!hasPermissions) return false;
        }

        if (item.roles && userRoles) {
          const hasRoles = item.roles.some((r) => userRoles.includes(r));
          if (!hasRoles) return false;
        }

        return true;
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterItemsByPermission(item.children) : undefined,
      }));
  }, [userPermissions, userRoles]);

  const filteredItems = useMemo(
    () => filterItemsByPermission(items),
    [items, filterItemsByPermission]
  );

  if (filteredItems.length === 0 && fallback) {
    return <>{fallback}</>;
  }

  return (
    <NavigationMenu
      items={filteredItems}
      className={className}
      LinkComponent={LinkComponent}
    />
  );
}

// ============================================================================
// COMPONENT: RoleBasedNav - Role-based navigation
// ============================================================================

interface RoleBasedNavProps {
  items: MenuItem[];
  userRoles: string[];
  fallback?: ReactNode;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Role-based navigation component
 *
 * @example
 * ```tsx
 * <RoleBasedNav
 *   items={menuItems}
 *   userRoles={['admin', 'editor']}
 * />
 * ```
 */
export function RoleBasedNav({
  items,
  userRoles,
  fallback,
  className = '',
  LinkComponent,
}: RoleBasedNavProps) {
  return (
    <PermissionBasedMenu
      items={items}
      userPermissions={[]}
      userRoles={userRoles}
      fallback={fallback}
      className={className}
      LinkComponent={LinkComponent}
    />
  );
}

// ============================================================================
// COMPONENT: ResponsiveMenu - Responsive menu (desktop/mobile)
// ============================================================================

interface ResponsiveMenuProps {
  items: MenuItem[];
  breakpoint?: number;
  desktopVariant?: MenuVariant;
  mobilePosition?: 'left' | 'right';
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Responsive menu that switches between desktop and mobile layouts
 *
 * @example
 * ```tsx
 * <ResponsiveMenu
 *   items={menuItems}
 *   breakpoint={768}
 *   desktopVariant="underline"
 * />
 * ```
 */
export function ResponsiveMenu({
  items,
  breakpoint = 768,
  desktopVariant = 'default',
  mobilePosition = 'left',
  className = '',
  LinkComponent,
}: ResponsiveMenuProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return (
    <div className={`responsive-menu ${className}`}>
      {isMobile ? (
        <MobileMenu items={items} position={mobilePosition} LinkComponent={LinkComponent} />
      ) : (
        <NavigationMenu
          items={items}
          orientation="horizontal"
          variant={desktopVariant}
          LinkComponent={LinkComponent}
        />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: AdaptiveNav - Adaptive navigation with overflow handling
// ============================================================================

interface AdaptiveNavProps {
  items: MenuItem[];
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Adaptive navigation that handles overflow items
 *
 * @example
 * ```tsx
 * <AdaptiveNav items={manyMenuItems} />
 * ```
 */
export function AdaptiveNav({
  items,
  className = '',
  LinkComponent,
}: AdaptiveNavProps) {
  const [visibleItems, setVisibleItems] = useState(items);
  const [overflowItems, setOverflowItems] = useState<MenuItem[]>([]);

  // Simplified: In production, measure actual width and calculate overflow
  useEffect(() => {
    setVisibleItems(items.slice(0, 5));
    setOverflowItems(items.slice(5));
  }, [items]);

  return (
    <nav className={`adaptive-nav ${className}`}>
      <NavigationMenu items={visibleItems} orientation="horizontal" LinkComponent={LinkComponent} />
      {overflowItems.length > 0 && (
        <Dropdown
          trigger={<button>More</button>}
          items={overflowItems}
          LinkComponent={LinkComponent}
        />
      )}
    </nav>
  );
}

// ============================================================================
// COMPONENT: CollapsibleMenu - Collapsible menu with expand/collapse
// ============================================================================

interface CollapsibleMenuProps {
  items: MenuItem[];
  defaultCollapsed?: boolean;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Collapsible menu component
 *
 * @example
 * ```tsx
 * <CollapsibleMenu items={menuItems} defaultCollapsed />
 * ```
 */
export function CollapsibleMenu({
  items,
  defaultCollapsed = false,
  className = '',
  LinkComponent,
}: CollapsibleMenuProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className={`collapsible-menu ${isCollapsed ? 'collapsed' : ''} ${className}`}>
      <button
        className="collapsible-menu-toggle"
        onClick={toggle}
        aria-expanded={!isCollapsed}
      >
        {isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
      </button>
      {!isCollapsed && (
        <NavigationMenu items={items} orientation="vertical" LinkComponent={LinkComponent} />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: MenuSearch - Menu search/filter component
// ============================================================================

interface MenuSearchProps {
  items: MenuItem[];
  placeholder?: string;
  onSearch?: (query: string, results: MenuItem[]) => void;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Menu search/filter component
 *
 * @example
 * ```tsx
 * <MenuSearch
 *   items={allMenuItems}
 *   placeholder="Search menu..."
 *   onSearch={handleSearch}
 * />
 * ```
 */
export function MenuSearch({
  items,
  placeholder = 'Search...',
  onSearch,
  className = '',
  LinkComponent,
}: MenuSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>(items);

  const searchItems = useCallback((searchQuery: string, menuItems: MenuItem[]): MenuItem[] => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered: MenuItem[] = [];

    const search = (itemList: MenuItem[]) => {
      itemList.forEach((item) => {
        if (item.hidden) return;

        const matches =
          item.label.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery);

        if (matches) {
          filtered.push(item);
        }

        if (item.children) {
          search(item.children);
        }
      });
    };

    search(menuItems);
    return filtered;
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(items);
      onSearch?.('', items);
      return;
    }

    const filtered = searchItems(query, items);
    setResults(filtered);
    onSearch?.(query, filtered);
  }, [query, items, searchItems, onSearch]);

  return (
    <div className={`menu-search ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="menu-search-input"
        aria-label="Search menu"
      />
      {results.length > 0 ? (
        <NavigationMenu items={results} orientation="vertical" LinkComponent={LinkComponent} />
      ) : (
        <div className="menu-search-empty">No results found</div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT: QuickLinks - Quick links menu
// ============================================================================

interface QuickLinksProps {
  items: MenuItem[];
  title?: string;
  max?: number;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Quick links menu component
 *
 * @example
 * ```tsx
 * <QuickLinks
 *   items={frequentLinks}
 *   title="Quick Access"
 *   max={5}
 * />
 * ```
 */
export function QuickLinks({
  items,
  title = 'Quick Links',
  max = 10,
  className = '',
  LinkComponent,
}: QuickLinksProps) {
  const displayItems = useMemo(() => items.slice(0, max), [items, max]);

  return (
    <div className={`quick-links ${className}`}>
      {title && <h3 className="quick-links-title">{title}</h3>}
      <NavigationMenu
        items={displayItems}
        orientation="vertical"
        size="sm"
        LinkComponent={LinkComponent}
      />
    </div>
  );
}

// ============================================================================
// COMPONENT: FavoriteLinks - Favorite/bookmarked links
// ============================================================================

interface FavoriteLinksProps {
  items: MenuItem[];
  onToggleFavorite?: (itemId: string) => void;
  className?: string;
  LinkComponent?: ComponentType<any>;
}

/**
 * Favorite/bookmarked links component
 *
 * @example
 * ```tsx
 * <FavoriteLinks
 *   items={favoriteItems}
 *   onToggleFavorite={handleToggleFavorite}
 * />
 * ```
 */
export function FavoriteLinks({
  items,
  onToggleFavorite,
  className = '',
  LinkComponent,
}: FavoriteLinksProps) {
  const renderItem = useCallback((item: MenuItem, defaultRender: ReactNode) => {
    return (
      <div className="favorite-link-wrapper">
        {defaultRender}
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="favorite-toggle"
            aria-label="Remove from favorites"
          >
            ★
          </button>
        )}
      </div>
    );
  }, [onToggleFavorite]);

  return (
    <div className={`favorite-links ${className}`}>
      <h3 className="favorite-links-title">Favorites</h3>
      {items.length > 0 ? (
        <NavigationMenu
          items={items}
          orientation="vertical"
          renderItem={renderItem}
          LinkComponent={LinkComponent}
        />
      ) : (
        <div className="favorite-links-empty">No favorites yet</div>
      )}
    </div>
  );
}

// ============================================================================
// UTILITY: buildMenuHierarchy - Build menu hierarchy from flat list
// ============================================================================

/**
 * Build menu hierarchy from flat list of items with parent IDs
 *
 * @param items - Flat list of menu items with parentId
 * @returns Hierarchical menu structure
 *
 * @example
 * ```tsx
 * const flatItems = [
 *   { id: '1', label: 'Home', parentId: null },
 *   { id: '2', label: 'About', parentId: '1' }
 * ];
 * const hierarchy = buildMenuHierarchy(flatItems);
 * ```
 */
export function buildMenuHierarchy(
  items: Array<MenuItem & { parentId?: string | null }>
): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  // Create map and initialize children arrays
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Build hierarchy
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id)!;
    if (!item.parentId) {
      rootItems.push(menuItem);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(menuItem);
      }
    }
  });

  return rootItems;
}

// ============================================================================
// UTILITY: flattenMenuItems - Flatten menu hierarchy
// ============================================================================

/**
 * Flatten menu hierarchy into a flat list
 *
 * @param items - Hierarchical menu items
 * @returns Flat list of menu items
 *
 * @example
 * ```tsx
 * const flatItems = flattenMenuItems(hierarchicalMenu);
 * ```
 */
export function flattenMenuItems(items: MenuItem[]): MenuItem[] {
  const flattened: MenuItem[] = [];

  const flatten = (menuItems: MenuItem[]) => {
    menuItems.forEach((item) => {
      flattened.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  };

  flatten(items);
  return flattened;
}

// ============================================================================
// UTILITY: findMenuItem - Find menu item by ID
// ============================================================================

/**
 * Find menu item by ID in hierarchy
 *
 * @param items - Menu items to search
 * @param id - Item ID to find
 * @returns Found menu item or undefined
 *
 * @example
 * ```tsx
 * const item = findMenuItem(menuItems, 'dashboard');
 * ```
 */
export function findMenuItem(items: MenuItem[], id: string): MenuItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

// ============================================================================
// UTILITY: getMenuItemPath - Get path to menu item
// ============================================================================

/**
 * Get path (array of items) from root to specified item
 *
 * @param items - Menu items
 * @param id - Target item ID
 * @returns Array of items from root to target, or empty array if not found
 *
 * @example
 * ```tsx
 * const path = getMenuItemPath(menuItems, 'settings');
 * // Returns: [homeItem, dashboardItem, settingsItem]
 * ```
 */
export function getMenuItemPath(items: MenuItem[], id: string): MenuItem[] {
  const findPath = (menuItems: MenuItem[], targetId: string, currentPath: MenuItem[]): MenuItem[] | null => {
    for (const item of menuItems) {
      const newPath = [...currentPath, item];
      if (item.id === targetId) {
        return newPath;
      }
      if (item.children) {
        const foundPath = findPath(item.children, targetId, newPath);
        if (foundPath) return foundPath;
      }
    }
    return null;
  };

  return findPath(items, id, []) || [];
}
