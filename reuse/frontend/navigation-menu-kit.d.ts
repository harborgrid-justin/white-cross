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
import React, { ReactNode, MouseEvent, CSSProperties, ComponentType } from 'react';
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
/**
 * Hook to access navigation context
 * @returns Navigation context value
 */
export declare function useNavigationContext(): NavigationContextValue;
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
export declare function useNavigation(config: NavigationConfig, options?: {
    onActiveChange?: (id: string | null) => void;
    onMenuToggle?: (isOpen: boolean) => void;
    userPermissions?: string[];
    userRoles?: string[];
}): {
    state: any;
    config: NavigationConfig;
    setActiveId: any;
    toggleExpanded: any;
    setExpandedIds: any;
    toggleMenu: any;
    openMenu: any;
    closeMenu: any;
    toggleCollapsed: any;
    setHoveredId: any;
    setFocusedId: any;
    getMenuItem: any;
    getActiveItem: any;
    getParentItem: any;
    getBreadcrumbs: any;
    hasPermission: any;
};
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
export declare function useMenuState(defaultOpen?: boolean): {
    isOpen: any;
    toggle: any;
    open: any;
    close: any;
    setIsOpen: any;
};
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
export declare function useActiveRoute(items: MenuItem[], currentPath?: string, options?: {
    exact?: boolean;
    caseSensitive?: boolean;
    matcher?: (item: MenuItem, path: string) => boolean;
}): {
    activeId: any;
    activeItem: any;
    isActive: any;
};
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
export declare function NavigationProvider({ config, children, userPermissions, userRoles, onActiveChange, onMenuToggle, }: NavigationProviderProps): boolean;
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
export declare function NavigationMenu({ items, orientation, alignment, variant, size, className, style, onItemClick, renderItem, LinkComponent, }: NavigationMenuProps): void;
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
export declare function MainNav({ items, logo, actions, variant, sticky, className, LinkComponent, }: MainNavProps): any;
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
export declare function TopNav({ leftItems, centerItems, rightItems, className, LinkComponent, }: TopNavProps): any;
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
export declare function SideNav({ items, position, width, collapsible, defaultCollapsed, className, header, footer, LinkComponent, }: SideNavProps): any;
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
export declare function MenuBuilder({ initialItems, onChange, maxDepth, className, }: MenuBuilderProps): any;
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
export declare function MenuEditor({ items, onChange, onItemSelect, className, }: MenuEditorProps): void;
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
export declare function MenuDragDrop({ items, onChange, className, }: MenuDragDropProps): any;
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
export declare function MenuItemComponent({ item, onClick, active, className, LinkComponent, }: MenuItemComponentProps): {
    item: MenuItem;
    "": any;
} | null;
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
export declare function MenuLink({ href, children, active, disabled, external, className, LinkComponent, }: MenuLinkProps): {
    href: string;
};
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
export declare function MenuButton({ children, onClick, active, disabled, className, }: MenuButtonProps): string;
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
export declare function MenuDivider({ className, label }: MenuDividerProps): any;
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
export declare function NestedMenu({ items, depth, maxDepth, className, LinkComponent, }: NestedMenuProps): void;
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
export declare function SubMenu({ trigger, items, open: controlledOpen, onOpenChange, className, LinkComponent, }: SubMenuProps): any;
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
export declare function Dropdown({ trigger, items, placement, className, LinkComponent, }: DropdownProps): {
    dropdownRef: any;
};
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
export declare function MegaMenu({ trigger, columns, className, LinkComponent, }: MegaMenuProps): any;
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
export declare function MobileMenu({ items, trigger, position, className, LinkComponent, }: MobileMenuProps): string;
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
export declare function Hamburger({ isOpen, onClick, className }: HamburgerProps): any;
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
export declare function SlideMenu({ items, isOpen, onClose, position, width, className, LinkComponent, }: SlideMenuProps): string;
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
export declare function OffCanvas({ children, isOpen, onClose, position, className, }: OffCanvasProps): string;
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
export declare function BreadcrumbNav({ items, separator, showHome, homeHref, className, LinkComponent, }: BreadcrumbNavProps): any;
/**
 * Breadcrumbs component (alias for BreadcrumbNav)
 */
export declare const Breadcrumbs: typeof BreadcrumbNav;
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
export declare function BreadcrumbItemComponent({ item, separator, showSeparator, LinkComponent, }: BreadcrumbItemComponentProps): any;
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
export declare function TabNav({ tabs, activeTab: controlledActiveTab, onTabChange, variant, orientation, className, }: TabNavProps): any;
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
export declare function TabList({ children, className }: TabListProps): any;
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
export declare function TabPanel({ children, active, className }: TabPanelProps): string;
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
export declare function TabBar({ tabs, activeTab, onTabChange, className, }: TabBarProps): any;
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
export declare function PaginationNav({ config, onPageChange, onPageSizeChange, className, }: PaginationNavProps): any;
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
export declare function StepNav({ steps, currentStep, onStepChange, orientation, className, }: StepNavProps): any;
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
export declare function WizardNav({ steps, currentStepIndex, onNext, onPrevious, onStepChange, showStepNumber, className, }: WizardNavProps): any;
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
export declare function FooterNav({ sections, items, className, LinkComponent, }: FooterNavProps): any;
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
export declare function SocialNav({ links, className }: SocialNavProps): any;
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
export declare function UtilityNav({ items, className, LinkComponent, }: UtilityNavProps): any;
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
export declare function MenuHighlight({ targetRef, className }: MenuHighlightProps): div;
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
export declare function ActiveIndicator({ active, position, className, }: ActiveIndicatorProps): any;
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
export declare function MenuBadges({ count, label, variant, showZero, max, className, }: MenuBadgesProps): any;
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
export declare function PermissionBasedMenu({ items, userPermissions, userRoles, fallback, className, LinkComponent, }: PermissionBasedMenuProps): boolean | {
    filteredItems: any;
};
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
export declare function RoleBasedNav({ items, userRoles, fallback, className, LinkComponent, }: RoleBasedNavProps): {
    items: MenuItem[];
};
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
export declare function ResponsiveMenu({ items, breakpoint, desktopVariant, mobilePosition, className, LinkComponent, }: ResponsiveMenuProps): any;
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
export declare function AdaptiveNav({ items, className, LinkComponent, }: AdaptiveNavProps): any;
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
export declare function CollapsibleMenu({ items, defaultCollapsed, className, LinkComponent, }: CollapsibleMenuProps): any;
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
export declare function MenuSearch({ items, placeholder, onSearch, className, LinkComponent, }: MenuSearchProps): any;
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
export declare function QuickLinks({ items, title, max, className, LinkComponent, }: QuickLinksProps): any;
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
export declare function FavoriteLinks({ items, onToggleFavorite, className, LinkComponent, }: FavoriteLinksProps): void;
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
export declare function buildMenuHierarchy(items: Array<MenuItem & {
    parentId?: string | null;
}>): MenuItem[];
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
export declare function flattenMenuItems(items: MenuItem[]): MenuItem[];
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
export declare function findMenuItem(items: MenuItem[], id: string): MenuItem | undefined;
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
export declare function getMenuItemPath(items: MenuItem[], id: string): MenuItem[];
export {};
//# sourceMappingURL=navigation-menu-kit.d.ts.map