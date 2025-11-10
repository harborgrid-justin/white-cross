"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumbs = void 0;
exports.useNavigationContext = useNavigationContext;
exports.useNavigation = useNavigation;
exports.useMenuState = useMenuState;
exports.useActiveRoute = useActiveRoute;
exports.NavigationProvider = NavigationProvider;
exports.NavigationMenu = NavigationMenu;
exports.MainNav = MainNav;
exports.TopNav = TopNav;
exports.SideNav = SideNav;
exports.MenuBuilder = MenuBuilder;
exports.MenuEditor = MenuEditor;
exports.MenuDragDrop = MenuDragDrop;
exports.MenuItemComponent = MenuItemComponent;
exports.MenuLink = MenuLink;
exports.MenuButton = MenuButton;
exports.MenuDivider = MenuDivider;
exports.NestedMenu = NestedMenu;
exports.SubMenu = SubMenu;
exports.Dropdown = Dropdown;
exports.MegaMenu = MegaMenu;
exports.MobileMenu = MobileMenu;
exports.Hamburger = Hamburger;
exports.SlideMenu = SlideMenu;
exports.OffCanvas = OffCanvas;
exports.BreadcrumbNav = BreadcrumbNav;
exports.BreadcrumbItemComponent = BreadcrumbItemComponent;
exports.TabNav = TabNav;
exports.TabList = TabList;
exports.TabPanel = TabPanel;
exports.TabBar = TabBar;
exports.PaginationNav = PaginationNav;
exports.StepNav = StepNav;
exports.WizardNav = WizardNav;
exports.FooterNav = FooterNav;
exports.SocialNav = SocialNav;
exports.UtilityNav = UtilityNav;
exports.MenuHighlight = MenuHighlight;
exports.ActiveIndicator = ActiveIndicator;
exports.MenuBadges = MenuBadges;
exports.PermissionBasedMenu = PermissionBasedMenu;
exports.RoleBasedNav = RoleBasedNav;
exports.ResponsiveMenu = ResponsiveMenu;
exports.AdaptiveNav = AdaptiveNav;
exports.CollapsibleMenu = CollapsibleMenu;
exports.MenuSearch = MenuSearch;
exports.QuickLinks = QuickLinks;
exports.FavoriteLinks = FavoriteLinks;
exports.buildMenuHierarchy = buildMenuHierarchy;
exports.flattenMenuItems = flattenMenuItems;
exports.findMenuItem = findMenuItem;
exports.getMenuItemPath = getMenuItemPath;
const react_1 = require("react");
const NavigationContext = (0, react_1.createContext)(undefined);
/**
 * Hook to access navigation context
 * @returns Navigation context value
 */
function useNavigationContext() {
    const context = (0, react_1.useContext)(NavigationContext);
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
function useNavigation(config, options) {
    const [state, setState] = (0, react_1.useState)({
        activeId: null,
        expandedIds: new Set(),
        isOpen: false,
        isCollapsed: config.defaultCollapsed ?? false,
        hoveredId: null,
        focusedId: null,
    });
    // Flatten menu items for easy lookup
    const flattenedItems = (0, react_1.useMemo)(() => {
        const items = new Map();
        const flatten = (menuItems, parent) => {
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
    const parentMap = (0, react_1.useMemo)(() => {
        const map = new Map();
        const buildMap = (items, parent) => {
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
    (0, react_1.useEffect)(() => {
        if (!config.currentPath)
            return;
        const isActive = config.isActiveItem || ((item, path) => {
            if (!item.href || !path)
                return false;
            return item.href === path || path.startsWith(item.href + '/');
        });
        let activeItem;
        for (const [, item] of flattenedItems) {
            if (isActive(item, config.currentPath)) {
                activeItem = item;
                break;
            }
        }
        if (activeItem) {
            setState((prev) => ({ ...prev, activeId: activeItem.id }));
            options?.onActiveChange?.(activeItem.id);
            // Auto-expand parent items if configured
            if (config.autoExpand !== false) {
                const expandIds = new Set();
                let current = activeItem;
                while (current) {
                    const parent = parentMap.get(current.id);
                    if (parent) {
                        expandIds.add(parent.id);
                        current = parent;
                    }
                    else {
                        break;
                    }
                }
                setState((prev) => ({ ...prev, expandedIds: expandIds }));
            }
        }
    }, [config.currentPath, config.isActiveItem, config.autoExpand, flattenedItems, parentMap, options]);
    const setActiveId = (0, react_1.useCallback)((id) => {
        setState((prev) => ({ ...prev, activeId: id }));
        options?.onActiveChange?.(id);
    }, [options]);
    const toggleExpanded = (0, react_1.useCallback)((id) => {
        setState((prev) => {
            const newExpanded = new Set(prev.expandedIds);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            }
            else {
                newExpanded.add(id);
            }
            return { ...prev, expandedIds: newExpanded };
        });
    }, []);
    const setExpandedIds = (0, react_1.useCallback)((ids) => {
        setState((prev) => ({ ...prev, expandedIds: new Set(ids) }));
    }, []);
    const toggleMenu = (0, react_1.useCallback)(() => {
        setState((prev) => {
            const newIsOpen = !prev.isOpen;
            options?.onMenuToggle?.(newIsOpen);
            return { ...prev, isOpen: newIsOpen };
        });
    }, [options]);
    const openMenu = (0, react_1.useCallback)(() => {
        setState((prev) => ({ ...prev, isOpen: true }));
        options?.onMenuToggle?.(true);
    }, [options]);
    const closeMenu = (0, react_1.useCallback)(() => {
        setState((prev) => ({ ...prev, isOpen: false }));
        options?.onMenuToggle?.(false);
    }, [options]);
    const toggleCollapsed = (0, react_1.useCallback)(() => {
        setState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
    }, []);
    const setHoveredId = (0, react_1.useCallback)((id) => {
        setState((prev) => ({ ...prev, hoveredId: id }));
    }, []);
    const setFocusedId = (0, react_1.useCallback)((id) => {
        setState((prev) => ({ ...prev, focusedId: id }));
    }, []);
    const getMenuItem = (0, react_1.useCallback)((id) => {
        return flattenedItems.get(id);
    }, [flattenedItems]);
    const getActiveItem = (0, react_1.useCallback)(() => {
        return state.activeId ? flattenedItems.get(state.activeId) : undefined;
    }, [state.activeId, flattenedItems]);
    const getParentItem = (0, react_1.useCallback)((id) => {
        return parentMap.get(id);
    }, [parentMap]);
    const getBreadcrumbs = (0, react_1.useCallback)(() => {
        if (!state.activeId)
            return [];
        const breadcrumbs = [];
        let currentId = state.activeId;
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
    const hasPermission = (0, react_1.useCallback)((item, userPermissions, userRoles) => {
        if (!item.permissions && !item.roles)
            return true;
        if (item.permissions && userPermissions) {
            const hasRequiredPermissions = item.permissions.every((p) => userPermissions.includes(p));
            if (!hasRequiredPermissions)
                return false;
        }
        if (item.roles && userRoles) {
            const hasRequiredRoles = item.roles.some((r) => userRoles.includes(r));
            if (!hasRequiredRoles)
                return false;
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
function useMenuState(defaultOpen = false) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(defaultOpen);
    const toggle = (0, react_1.useCallback)(() => {
        setIsOpen((prev) => !prev);
    }, []);
    const open = (0, react_1.useCallback)(() => {
        setIsOpen(true);
    }, []);
    const close = (0, react_1.useCallback)(() => {
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
function useActiveRoute(items, currentPath, options) {
    const [activeId, setActiveId] = (0, react_1.useState)(null);
    const [activeItem, setActiveItem] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!currentPath)
            return;
        const normalizedPath = options?.caseSensitive ? currentPath : currentPath.toLowerCase();
        const findActive = (menuItems) => {
            for (const item of menuItems) {
                if (item.hidden || item.disabled)
                    continue;
                const itemPath = options?.caseSensitive ? item.href : item.href?.toLowerCase();
                if (options?.matcher) {
                    if (options.matcher(item, currentPath)) {
                        return item;
                    }
                }
                else if (itemPath) {
                    if (options?.exact) {
                        if (itemPath === normalizedPath) {
                            return item;
                        }
                    }
                    else {
                        if (normalizedPath.startsWith(itemPath)) {
                            return item;
                        }
                    }
                }
                if (item.children) {
                    const childActive = findActive(item.children);
                    if (childActive)
                        return childActive;
                }
            }
            return null;
        };
        const active = findActive(items);
        setActiveId(active?.id || null);
        setActiveItem(active);
    }, [items, currentPath, options]);
    const isActive = (0, react_1.useCallback)((itemId) => {
        return activeId === itemId;
    }, [activeId]);
    return { activeId, activeItem, isActive };
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
function NavigationProvider({ config, children, userPermissions, userRoles, onActiveChange, onMenuToggle, }) {
    const navigation = useNavigation(config, { onActiveChange, onMenuToggle, userPermissions, userRoles });
    const contextValue = {
        ...navigation,
    };
    return value = { contextValue } >
        { children }
        < /NavigationContext.Provider>;
    ;
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
function NavigationMenu({ items, orientation = 'horizontal', alignment = 'left', variant = 'default', size = 'md', className = '', style, onItemClick, renderItem, LinkComponent = 'a', }) {
    const handleItemClick = (0, react_1.useCallback)((item, e) => {
        if (item.disabled) {
            e.preventDefault();
            return;
        }
        item.onClick?.(e);
        onItemClick?.(item, e);
    }, [onItemClick]);
    const renderMenuItem = (0, react_1.useCallback)((item) => {
        if (item.hidden)
            return null;
        const defaultRender = key = { item, : .id };
        href = { item, : .href };
        target = { item, : .target };
        className = {} `nav-item nav-item-${variant} nav-item-${size} ${item.disabled ? 'disabled' : ''} ${item.className || ''}`;
    }, onClick = {}(e, (react_1.MouseEvent)));
    handleItemClick(item, e);
}
aria - disabled;
{
    item.disabled;
}
    >
        { item, : .icon && className, "nav-item-icon":  > { item, : .icon } < /span> }
    < span;
className = "nav-item-label" > { item, : .label } < /span>;
{
    item.badge && className;
    {
        `nav-item-badge badge-${item.badgeVariant || 'default'}`;
    }
     >
        { item, : .badge }
        < /span>;
}
/LinkComponent>;
;
return renderItem ? renderItem(item, defaultRender) : defaultRender;
[variant, size, LinkComponent, handleItemClick, renderItem];
;
return className = {} `navigation-menu nav-${orientation} nav-align-${alignment} ${className}`;
style = { style };
role = "navigation"
    >
        { items, : .map(renderMenuItem) }
    < /nav>;
;
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
function MainNav({ items, logo, actions, variant = 'default', sticky = false, className = '', LinkComponent, }) {
    return className = {} `main-nav ${sticky ? 'sticky' : ''} ${className}`;
}
 >
    { logo } && className;
"main-nav-logo" > { logo } < /div>;
items;
{
    items;
}
orientation = "horizontal";
variant = { variant };
LinkComponent = { LinkComponent }
    /  >
    { actions } && className;
"main-nav-actions" > { actions } < /div>;
/header>;
;
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
function TopNav({ leftItems, centerItems, rightItems, className = '', LinkComponent, }) {
    return className = {} `top-nav ${className}`;
}
role = "navigation" >
    { leftItems } && className;
"top-nav-left" >
    items;
{
    leftItems;
}
orientation = "horizontal";
LinkComponent = { LinkComponent } /  >
    /div>;
{
    centerItems && className;
    "top-nav-center" >
        items;
    {
        centerItems;
    }
    orientation = "horizontal";
    LinkComponent = { LinkComponent } /  >
        /div>;
}
{
    rightItems && className;
    "top-nav-right" >
        items;
    {
        rightItems;
    }
    orientation = "horizontal";
    LinkComponent = { LinkComponent } /  >
        /div>;
}
/nav>;
;
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
function SideNav({ items, position = 'left', width = 280, collapsible = false, defaultCollapsed = false, className = '', header, footer, LinkComponent, }) {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(defaultCollapsed);
    const toggleCollapsed = (0, react_1.useCallback)(() => {
        setIsCollapsed((prev) => !prev);
    }, []);
    return className = {} `side-nav side-nav-${position} ${isCollapsed ? 'collapsed' : ''} ${className}`;
}
style = {};
{
    width: isCollapsed ? '64px' : width;
}
    >
        { header } && className;
"side-nav-header" > { header } < /div>;
className;
"side-nav-content" >
    items;
{
    items;
}
orientation = "vertical";
LinkComponent = { LinkComponent }
    /  >
    /div>;
{
    footer && className;
    "side-nav-footer" > { footer } < /div>;
}
{
    collapsible && className;
    "side-nav-toggle";
    onClick = { toggleCollapsed };
    aria - label;
    {
        isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
        >
            { isCollapsed, '→': '←' }
        < /button>;
}
/aside>;
;
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
function MenuBuilder({ initialItems = [], onChange, maxDepth = 3, className = '', }) {
    const [items, setItems] = (0, react_1.useState)(initialItems);
    const handleChange = (0, react_1.useCallback)((newItems) => {
        setItems(newItems);
        onChange?.(newItems);
    }, [onChange]);
    const addItem = (0, react_1.useCallback)(() => {
        const newItem = {
            id: `item-${Date.now()}`,
            label: 'New Item',
            href: '#',
        };
        handleChange([...items, newItem]);
    }, [items, handleChange]);
    const removeItem = (0, react_1.useCallback)((id) => {
        const removeFromItems = (menuItems) => {
            return menuItems.filter((item) => {
                if (item.id === id)
                    return false;
                if (item.children) {
                    item.children = removeFromItems(item.children);
                }
                return true;
            });
        };
        handleChange(removeFromItems(items));
    }, [items, handleChange]);
    const updateItem = (0, react_1.useCallback)((id, updates) => {
        const updateInItems = (menuItems) => {
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
    return className = {} `menu-builder ${className}`;
}
 >
    className;
"menu-builder-header" >
    Menu;
Builder < /h3>
    < button;
onClick = { addItem };
className = "btn-add-item" >
    Add;
Item
    < /button>
    < /div>
    < div;
className = "menu-builder-items" >
    { items, : .map((item) => key = { item, : .id }, className = "menu-builder-item" >
            type, "text", value = { item, : .label }, onChange = {}(e), updateItem(item.id, { label: e.target.value })) };
placeholder = "Label"
    /  >
    type;
"text";
value = { item, : .href || '' };
onChange = {}(e);
updateItem(item.id, { href: e.target.value });
placeholder = "URL"
    /  >
    onClick;
{
    () => removeItem(item.id);
}
 > Remove < /button>
    < /div>;
/div>
    < /div>;
;
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
function MenuEditor({ items, onChange, onItemSelect, className = '', }) {
    const [selectedId, setSelectedId] = (0, react_1.useState)(null);
    const handleSelect = (0, react_1.useCallback)((item) => {
        setSelectedId(item.id);
        onItemSelect?.(item);
    }, [onItemSelect]);
    const renderItem = (0, react_1.useCallback)((item, depth = 0) => {
        return key = { item, : .id };
        className = {} `menu-editor-item ${selectedId === item.id ? 'selected' : ''}`;
    }, style = {}, { paddingLeft: `${depth * 20}px` });
}
onClick = {}();
handleSelect(item);
    >
        { item, : .label } < /span>;
{
    item.children && item.children.length > 0 && className;
    "child-count" > ({ item, : .children.length }) < /span>;
}
/div>;
;
[selectedId, handleSelect];
;
const renderItems = (0, react_1.useCallback)((menuItems, depth = 0) => {
    return menuItems.map((item) => key = { item, : .id } >
        {}, { item, : .children && renderItems(item.children, depth + 1) }
        < /React.Fragment>);
});
[renderItem];
;
return className = {} `menu-editor ${className}`;
 >
    {}
    < /div>;
;
/**
 * Drag and drop menu organizer
 *
 * @example
 * ```tsx
 * <MenuDragDrop items={items} onChange={setItems} />
 * ```
 */
function MenuDragDrop({ items, onChange, className = '', }) {
    const [draggedId, setDraggedId] = (0, react_1.useState)(null);
    const handleDragStart = (0, react_1.useCallback)((id) => {
        setDraggedId(id);
    }, []);
    const handleDragEnd = (0, react_1.useCallback)(() => {
        setDraggedId(null);
    }, []);
    const handleDrop = (0, react_1.useCallback)((targetId) => {
        if (!draggedId || draggedId === targetId)
            return;
        // Implement reordering logic
        onChange(items);
    }, [draggedId, items, onChange]);
    return className = {} `menu-drag-drop ${className}`;
}
 >
    { items, : .map((item) => key = { item, : .id }, draggable, onDragStart = {}(), handleDragStart(item.id)) };
onDragEnd = { handleDragEnd };
onDrop = {}();
handleDrop(item.id);
className = {} `draggable-item ${draggedId === item.id ? 'dragging' : ''}`;
    >
        { item, : .label }
    < /div>;
/div>;
;
/**
 * Single menu item component
 *
 * @example
 * ```tsx
 * <MenuItem item={menuItem} active onClick={handleClick} />
 * ```
 */
function MenuItemComponent({ item, onClick, active = false, className = '', LinkComponent = 'a', }) {
    const handleClick = (0, react_1.useCallback)((e) => {
        if (item.disabled) {
            e.preventDefault();
            return;
        }
        item.onClick?.(e);
        onClick?.(e);
    }, [item, onClick]);
    if (item.hidden)
        return null;
    return href = { item, : .href };
    target = { item, : .target };
    className = {} `menu-item ${active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${className}`;
}
onClick = { handleClick };
aria - disabled;
{
    item.disabled;
}
aria - current;
{
    active ? 'page' : undefined;
}
    >
        { item, : .icon && className, "menu-item-icon":  > { item, : .icon } < /span> }
    < span;
className = "menu-item-label" > { item, : .label } < /span>;
{
    item.badge && className;
    {
        `menu-item-badge badge-${item.badgeVariant || 'default'}`;
    }
     >
        { item, : .badge }
        < /span>;
}
/LinkComponent>;
;
/**
 * Menu link component
 *
 * @example
 * ```tsx
 * <MenuLink href="/dashboard" active>Dashboard</MenuLink>
 * ```
 */
function MenuLink({ href, children, active = false, disabled = false, external = false, className = '', LinkComponent = 'a', }) {
    return href = { href };
    target = { external, '_blank': undefined };
    rel = { external, 'noopener noreferrer': undefined };
    className = {} `menu-link ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`;
}
aria - disabled;
{
    disabled;
}
aria - current;
{
    active ? 'page' : undefined;
}
    >
        { children };
{
    external && className;
    "external-icon" > ;
    /span>;
}
/LinkComponent>;
;
/**
 * Menu button component
 *
 * @example
 * ```tsx
 * <MenuButton onClick={handleClick} active>Settings</MenuButton>
 * ```
 */
function MenuButton({ children, onClick, active = false, disabled = false, className = '', }) {
    return type = "button";
    onClick = { onClick };
    disabled = { disabled };
    className = {} `menu-button ${active ? 'active' : ''} ${className}`;
}
aria - pressed;
{
    active;
}
    >
        { children }
    < /button>;
;
/**
 * Menu divider component
 *
 * @example
 * ```tsx
 * <MenuDivider label="Actions" />
 * ```
 */
function MenuDivider({ className = '', label }) {
    return className = {} `menu-divider ${className}`;
}
role = "separator" >
    { label } && className;
"menu-divider-label" > { label } < /span>;
/div>;
;
/**
 * Nested menu with collapsible children
 *
 * @example
 * ```tsx
 * <NestedMenu items={menuItems} maxDepth={3} />
 * ```
 */
function NestedMenu({ items, depth = 0, maxDepth = 5, className = '', LinkComponent, }) {
    const [expandedIds, setExpandedIds] = (0, react_1.useState)(new Set());
    const toggleExpanded = (0, react_1.useCallback)((id) => {
        setExpandedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            }
            else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);
    const renderItem = (0, react_1.useCallback)((item) => {
        if (item.hidden)
            return null;
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedIds.has(item.id);
        return key = { item, : .id };
        className = "nested-menu-item" >
            className;
        "nested-menu-item-content" >
            item;
        {
            item;
        }
        LinkComponent = { LinkComponent } /  >
            { hasChildren } && depth < maxDepth && onClick;
        {
            () => toggleExpanded(item.id);
        }
        className = "nested-menu-toggle";
        aria - expanded;
        {
            isExpanded;
        }
            >
                { isExpanded, '−': '+' }
            < /button>;
    });
}
/div>;
{
    hasChildren && isExpanded && depth < maxDepth && className;
    "nested-menu-children" >
        items;
    {
        item.children;
    }
    depth = { depth } + 1;
}
maxDepth = { maxDepth };
LinkComponent = { LinkComponent }
    /  >
    /div>;
/div>;
;
[depth, maxDepth, expandedIds, toggleExpanded, LinkComponent];
;
return className = {} `nested-menu nested-menu-depth-${depth} ${className}`;
 >
    { items, : .map(renderItem) }
    < /div>;
;
/**
 * Submenu component
 *
 * @example
 * ```tsx
 * <SubMenu trigger={<button>More</button>} items={subMenuItems} />
 * ```
 */
function SubMenu({ trigger, items, open: controlledOpen, onOpenChange, className = '', LinkComponent, }) {
    const [internalOpen, setInternalOpen] = (0, react_1.useState)(false);
    const isControlled = controlledOpen !== undefined;
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const setOpen = (0, react_1.useCallback)((open) => {
        if (!isControlled) {
            setInternalOpen(open);
        }
        onOpenChange?.(open);
    }, [isControlled, onOpenChange]);
    const toggleOpen = (0, react_1.useCallback)(() => {
        setOpen(!isOpen);
    }, [isOpen, setOpen]);
    return className = {} `submenu ${isOpen ? 'open' : ''} ${className}`;
}
 >
    className;
"submenu-trigger";
onClick = { toggleOpen } >
    { trigger }
    < /div>;
{
    isOpen && className;
    "submenu-content" >
        items;
    {
        items;
    }
    orientation = "vertical";
    LinkComponent = { LinkComponent } /  >
        /div>;
}
/div>;
;
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
function Dropdown({ trigger, items, placement = 'bottom-start', className = '', LinkComponent, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const dropdownRef = (0, react_1.useRef)(null);
    const toggleOpen = (0, react_1.useCallback)(() => {
        setIsOpen((prev) => !prev);
    }, []);
    const close = (0, react_1.useCallback)(() => {
        setIsOpen(false);
    }, []);
    (0, react_1.useEffect)(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                close();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, close]);
    return ref = { dropdownRef };
    className = {} `dropdown ${isOpen ? 'open' : ''} ${className}`;
}
 >
    className;
"dropdown-trigger";
onClick = { toggleOpen } >
    { trigger }
    < /div>;
{
    isOpen && className;
    {
        `dropdown-content dropdown-${placement}`;
    }
     >
        items;
    {
        items;
    }
    orientation = "vertical";
    LinkComponent = { LinkComponent };
    onItemClick = { close }
        /  >
        /div>;
}
/div>;
;
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
function MegaMenu({ trigger, columns, className = '', LinkComponent, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const open = (0, react_1.useCallback)(() => setIsOpen(true), []);
    const close = (0, react_1.useCallback)(() => setIsOpen(false), []);
    return className = {} `mega-menu ${isOpen ? 'open' : ''} ${className}`;
}
onMouseEnter = { open };
onMouseLeave = { close }
    >
        className;
"mega-menu-trigger" > { trigger } < /div>;
{
    isOpen && className;
    "mega-menu-content" >
        className;
    "mega-menu-columns" >
        { columns, : .map((column, index) => key = { index }, className = "mega-menu-column" >
                { column, : .title && className, "mega-menu-column-title":  > { column, : .title } < /h3> }
                < NavigationMenu, items = { column, : .items }, orientation = "vertical", LinkComponent = { LinkComponent }
                /  >
                /div>) }
        < /div>
        < /div>;
}
/div>;
;
/**
 * Mobile menu component
 *
 * @example
 * ```tsx
 * <MobileMenu items={mobileItems} position="left" />
 * ```
 */
function MobileMenu({ items, trigger, position = 'left', className = '', LinkComponent, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const toggle = (0, react_1.useCallback)(() => setIsOpen((prev) => !prev), []);
    const close = (0, react_1.useCallback)(() => setIsOpen(false), []);
    return className = "mobile-menu-trigger";
    onClick = { toggle };
    aria - label;
    "Toggle menu" >
        { trigger } || isOpen;
    {
        isOpen;
    }
    />;
}
/button>;
{
    isOpen && className;
    "mobile-menu-overlay";
    onClick = { close } /  >
        className;
    {
        `mobile-menu mobile-menu-${position} ${className}`;
    }
     >
        className;
    "mobile-menu-close";
    onClick = { close };
    aria - label;
    "Close menu" >
    ;
    /button>
        < NavigationMenu;
    items = { items };
    orientation = "vertical";
    LinkComponent = { LinkComponent };
    onItemClick = { close }
        /  >
        /div>
        < />;
}
/>;
;
/**
 * Hamburger menu icon
 *
 * @example
 * ```tsx
 * <Hamburger isOpen={isMenuOpen} onClick={toggleMenu} />
 * ```
 */
function Hamburger({ isOpen = false, onClick, className = '' }) {
    return className = {} `hamburger ${isOpen ? 'open' : ''} ${className}`;
}
onClick = { onClick };
aria - label;
{
    isOpen ? 'Close menu' : 'Open menu';
}
aria - expanded;
{
    isOpen;
}
    >
        className;
"hamburger-line" /  >
    className;
"hamburger-line" /  >
    className;
"hamburger-line" /  >
    /button>;
;
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
function SlideMenu({ items, isOpen, onClose, position = 'left', width = 320, className = '', LinkComponent, }) {
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
    return ({ isOpen } && className) = "slide-menu-overlay";
    onClick = { onClose } /  > ;
}
className;
{
    `slide-menu slide-menu-${position} ${isOpen ? 'open' : ''} ${className}`;
}
style = {};
{
    width;
}
    >
        className;
"slide-menu-header" >
    className;
"slide-menu-close";
onClick = { onClose };
aria - label;
"Close menu" >
;
/button>
    < /div>
    < div;
className = "slide-menu-content" >
    items;
{
    items;
}
orientation = "vertical";
LinkComponent = { LinkComponent };
onItemClick = { onClose }
    /  >
    /div>
    < /div>
    < />;
;
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
function OffCanvas({ children, isOpen, onClose, position = 'left', className = '', }) {
    return ({ isOpen } && className) = "offcanvas-overlay";
    onClick = { onClose } /  > ;
}
className;
{
    `offcanvas offcanvas-${position} ${isOpen ? 'open' : ''} ${className}`;
}
 >
    className;
"offcanvas-close";
onClick = { onClose };
aria - label;
"Close" >
;
/button>
    < div;
className = "offcanvas-content" > { children } < /div>
    < /div>
    < />;
;
/**
 * Breadcrumb navigation component
 *
 * @example
 * ```tsx
 * <BreadcrumbNav items={breadcrumbs} separator="/" showHome />
 * ```
 */
function BreadcrumbNav({ items, separator = '/', showHome = true, homeHref = '/', className = '', LinkComponent = 'a', }) {
    const allItems = (0, react_1.useMemo)(() => {
        if (showHome) {
            const homeItem = {
                id: 'home',
                label: 'Home',
                href: homeHref,
            };
            return [homeItem, ...items];
        }
        return items;
    }, [items, showHome, homeHref]);
    return className = {} `breadcrumb-nav ${className}`;
}
aria - label;
"Breadcrumb" >
    className;
"breadcrumb-list" >
    { allItems, : .map((item, index) => key = { item, : .id }, className = {} `breadcrumb-item ${item.current ? 'current' : ''}`) }
    >
        { item, : .current ? (aria - current) = "page" > { item, : .label } < /span>
                :
        }(href, { item, : .href } > { item, : .label } < /LinkComponent>);
{
    index < allItems.length - 1 && className;
    "breadcrumb-separator";
    aria - hidden;
    "true" >
        { separator }
        < /span>;
}
/li>;
/ol>
    < /nav>;
;
// ============================================================================
// COMPONENT: Breadcrumbs - Alias for BreadcrumbNav
// ============================================================================
/**
 * Breadcrumbs component (alias for BreadcrumbNav)
 */
exports.Breadcrumbs = BreadcrumbNav;
/**
 * Single breadcrumb item component
 *
 * @example
 * ```tsx
 * <BreadcrumbItemComponent item={item} separator="/" />
 * ```
 */
function BreadcrumbItemComponent({ item, separator = '/', showSeparator = true, LinkComponent = 'a', }) {
    return className = {} `breadcrumb-item ${item.current ? 'current' : ''}`;
}
 >
    { item, : .icon && className, "breadcrumb-icon":  > { item, : .icon } < /span> };
{
    item.current ? (aria - current) = "page" > { item, : .label } < /span>
        :
    ;
    href = { item, : .href } > { item, : .label } < /LinkComponent>;
}
{
    showSeparator && className;
    "breadcrumb-separator";
    aria - hidden;
    "true" >
        { separator }
        < /span>;
}
/li>;
;
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
function TabNav({ tabs, activeTab: controlledActiveTab, onTabChange, variant = 'default', orientation = 'horizontal', className = '', }) {
    const [internalActiveTab, setInternalActiveTab] = (0, react_1.useState)(tabs[0]?.id);
    const isControlled = controlledActiveTab !== undefined;
    const activeTab = isControlled ? controlledActiveTab : internalActiveTab;
    const handleTabChange = (0, react_1.useCallback)((tabId) => {
        if (!isControlled) {
            setInternalActiveTab(tabId);
        }
        onTabChange?.(tabId);
    }, [isControlled, onTabChange]);
    return className = {} `tab-nav tab-nav-${variant} tab-nav-${orientation} ${className}`;
}
 >
    className;
"tab-list";
role = "tablist" >
    { tabs, : .map((tab) => key = { tab, : .id }, role = "tab", aria - selected, { activeTab } === tab.id) };
aria - controls;
{
    `panel-${tab.id}`;
}
disabled = { tab, : .disabled };
className = {} `tab ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`;
onClick = {}();
handleTabChange(tab.id);
    >
        { tab, : .icon && className, "tab-icon":  > { tab, : .icon } < /span> }
    < span;
className = "tab-label" > { tab, : .label } < /span>;
{
    tab.badge && className;
    "tab-badge" > { tab, : .badge } < /span>;
}
{
    tab.closable && className;
    "tab-close";
    aria - label;
    {
        `Close ${tab.label}`;
    }
     >
    ;
    /button>;
}
/button>;
/div>
    < div;
className = "tab-panels" >
    { tabs, : .map((tab) => key = { tab, : .id }, id = {} `panel-${tab.id}`) };
role = "tabpanel";
aria - labelledby;
{
    tab.id;
}
hidden = { activeTab } !== tab.id;
className = "tab-panel"
    >
        { tab, : .content }
    < /div>;
/div>
    < /div>;
;
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
function TabList({ children, className = '' }) {
    return className = {} `tab-list ${className}`;
}
role = "tablist" >
    { children }
    < /div>;
;
/**
 * Tab panel component
 *
 * @example
 * ```tsx
 * <TabPanel active={isActive}>Panel content</TabPanel>
 * ```
 */
function TabPanel({ children, active = false, className = '' }) {
    return role = "tabpanel";
    hidden = {};
    active;
}
className = {} `tab-panel ${active ? 'active' : ''} ${className}`;
    >
        { children }
    < /div>;
;
/**
 * Tab bar component (simplified tab navigation)
 *
 * @example
 * ```tsx
 * <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
 * ```
 */
function TabBar({ tabs, activeTab, onTabChange, className = '', }) {
    return className = {} `tab-bar ${className}`;
}
 >
    { tabs, : .map((tab) => key = { tab, : .id }, className = {} `tab-bar-item ${activeTab === tab.id ? 'active' : ''}`) };
onClick = {}();
onTabChange?.(tab.id);
disabled = { tab, : .disabled }
    >
        { tab, : .icon && className, "tab-bar-icon":  > { tab, : .icon } < /span> }
    < span > { tab, : .label } < /span>;
{
    tab.badge && className;
    "tab-bar-badge" > { tab, : .badge } < /span>;
}
/button>;
/div>;
;
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
function PaginationNav({ config, onPageChange, onPageSizeChange, className = '', }) {
    const { currentPage, totalPages, pageSize, showPageSize = true, pageSizes = [10, 20, 50, 100], showFirstLast = true, siblingCount = 1, } = config;
    const pages = (0, react_1.useMemo)(() => {
        const pageNumbers = [];
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
    return className = {} `pagination-nav ${className}`;
}
aria - label;
"Pagination" >
    className;
"pagination-controls" >
    { showFirstLast } && onClick;
{
    () => onPageChange(1);
}
disabled = { currentPage } === 1;
aria - label;
"First page";
className = "pagination-button"
    >
;
/button>;
onClick;
{
    () => onPageChange(currentPage - 1);
}
disabled = { currentPage } === 1;
aria - label;
"Previous page";
className = "pagination-button"
    >
;
/button>;
{
    pages.map((page, index) => key = { index } >
        { typeof: page === 'number' ? onClick = {}() :  }, className = {} `pagination-button ${page === currentPage ? 'active' : ''}`);
}
aria - current;
{
    page === currentPage ? 'page' : undefined;
}
    >
        { page }
    < /button>;
className = "pagination-dots" > { page } < /span>;
/React.Fragment>;
onClick;
{
    () => onPageChange(currentPage + 1);
}
disabled = { currentPage } === totalPages;
aria - label;
"Next page";
className = "pagination-button"
    >
;
/button>;
{
    showFirstLast && onClick;
    {
        () => onPageChange(totalPages);
    }
    disabled = { currentPage } === totalPages;
}
aria - label;
"Last page";
className = "pagination-button"
    >
;
/button>;
/div>;
{
    showPageSize && onPageSizeChange && className;
    "pagination-page-size" >
        htmlFor;
    "page-size-select" > Items;
    per;
    page: /label>
        < select;
    id = "page-size-select";
    value = { pageSize };
    onChange = {}(e);
    onPageSizeChange(Number(e.target.value));
}
    >
        { pageSizes, : .map((size) => key = { size }, value = { size } >
                { size }
                < /option>) }
    < /select>
    < /div>;
/nav>;
;
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
function StepNav({ steps, currentStep, onStepChange, orientation = 'horizontal', className = '', }) {
    return className = {} `step-nav step-nav-${orientation} ${className}`;
}
aria - label;
"Steps" >
    className;
"step-list" >
    { steps, : .map((step, index) => key = { step, : .id }, className = {} `step ${step.current || step.id === currentStep ? 'current' : ''} ${step.completed ? 'completed' : ''} ${step.disabled ? 'disabled' : ''}`) }
    >
        onClick;
{
    () => !step.disabled && onStepChange?.(step.id);
}
disabled = { step, : .disabled };
className = "step-button";
aria - current;
{
    step.current || step.id === currentStep ? 'step' : undefined;
}
    >
        className;
"step-indicator" >
    { step, : .completed ? '✓' : step.icon || index + 1 }
    < /span>
    < span;
className = "step-content" >
    className;
"step-label" > { step, : .label } < /span>;
{
    step.description && className;
    "step-description" > { step, : .description } < /span>;
}
/span>
    < /button>
    < /li>;
/ol>
    < /nav>;
;
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
function WizardNav({ steps, currentStepIndex = 0, onNext, onPrevious, onStepChange, showStepNumber = true, className = '', }) {
    const currentStep = steps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;
    return className = {} `wizard-nav ${className}`;
}
 >
    className;
"wizard-progress" >
    className;
"wizard-progress-bar" >
    className;
"wizard-progress-fill";
style = {};
{
    width: `${((currentStepIndex + 1) / steps.length) * 100}%`;
}
/>
    < /div>
    < div;
className = "wizard-steps" >
    { steps, : .map((step, index) => key = { step, : .id }, onClick = {}(), onStepChange?.(index)) };
disabled = { step, : .disabled || index > currentStepIndex };
className = {} `wizard-step ${index === currentStepIndex ? 'current' : ''} ${step.completed ? 'completed' : ''}`;
aria - current;
{
    index === currentStepIndex ? 'step' : undefined;
}
    >
        className;
"wizard-step-indicator" >
    { step, : .completed ? '✓' : showStepNumber ? index + 1 : step.icon }
    < /span>
    < span;
className = "wizard-step-label" > { step, : .label } < /span>
    < /button>;
/div>
    < /div>
    < div;
className = "wizard-content" >
    { currentStep, content }
    < /div>
    < div;
className = "wizard-actions" >
    onClick;
{
    onPrevious;
}
disabled = { isFirstStep };
className = "wizard-button wizard-button-previous"
    >
        Previous
    < /button>
    < button;
onClick = { onNext };
className = "wizard-button wizard-button-next"
    >
        { isLastStep, 'Finish': 'Next' }
    < /button>
    < /div>
    < /div>;
;
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
function FooterNav({ sections, items, className = '', LinkComponent, }) {
    return className = {} `footer-nav ${className}`;
}
aria - label;
"Footer navigation" >
    {}
    < /div>;
items ? items = { items } : ;
orientation = "horizontal";
LinkComponent = { LinkComponent } /  >
;
null;
/nav>;
;
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
function SocialNav({ links, className = '' }) {
    return className = {} `social-nav ${className}`;
}
aria - label;
"Social media" >
    { links, : .map((link) => key = { link, : .id }, href = { link, : .url }, target = "_blank", rel = "noopener noreferrer", className = {} `social-link social-link-${link.platform}`) };
aria - label;
{
    link.label || `Visit our ${link.platform}`;
}
    >
        { link, : .icon || link.platform }
    < /a>;
/nav>;
;
/**
 * Utility navigation component (secondary navigation)
 *
 * @example
 * ```tsx
 * <UtilityNav items={utilityItems} />
 * ```
 */
function UtilityNav({ items, className = '', LinkComponent, }) {
    return className = {} `utility-nav ${className}`;
}
aria - label;
"Utility navigation" >
    items;
{
    items;
}
orientation = "horizontal";
size = "sm";
LinkComponent = { LinkComponent }
    /  >
    /nav>;
;
/**
 * Menu item highlight effect (animated underline/background)
 *
 * @example
 * ```tsx
 * const activeRef = useRef<HTMLElement>(null);
 * <MenuHighlight targetRef={activeRef} />
 * ```
 */
function MenuHighlight({ targetRef, className = '' }) {
    const [style, setStyle] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        if (!targetRef.current)
            return;
        const updatePosition = () => {
            if (!targetRef.current)
                return;
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
    return className;
    {
        `menu-highlight ${className}`;
    }
    style = { style } /  > ;
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
function ActiveIndicator({ active = false, position = 'left', className = '', }) {
    if (!active)
        return null;
    return className = {} `active-indicator active-indicator-${position} ${className}`;
}
aria - hidden;
"true"
    /  >
;
;
/**
 * Menu item badges component
 *
 * @example
 * ```tsx
 * <MenuBadges count={5} variant="danger" max={99} />
 * ```
 */
function MenuBadges({ count, label, variant = 'default', showZero = false, max = 99, className = '', }) {
    if (!showZero && count === 0)
        return null;
    if (!count && !label)
        return null;
    const displayValue = count !== undefined
        ? count > max
            ? `${max}+`
            : count.toString()
        : label;
    return className = {} `menu-badge menu-badge-${variant} ${className}`;
}
 >
    { displayValue }
    < /span>;
;
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
function PermissionBasedMenu({ items, userPermissions, userRoles, fallback, className = '', LinkComponent, }) {
    const filterItemsByPermission = (0, react_1.useCallback)((menuItems) => {
        return menuItems
            .filter((item) => {
            if (!item.permissions && !item.roles)
                return true;
            if (item.permissions) {
                const hasPermissions = item.permissions.every((p) => userPermissions.includes(p));
                if (!hasPermissions)
                    return false;
            }
            if (item.roles && userRoles) {
                const hasRoles = item.roles.some((r) => userRoles.includes(r));
                if (!hasRoles)
                    return false;
            }
            return true;
        })
            .map((item) => ({
            ...item,
            children: item.children ? filterItemsByPermission(item.children) : undefined,
        }));
    }, [userPermissions, userRoles]);
    const filteredItems = (0, react_1.useMemo)(() => filterItemsByPermission(items), [items, filterItemsByPermission]);
    if (filteredItems.length === 0 && fallback) {
        return { fallback } < />;
    }
    return items = { filteredItems };
    className = { className };
    LinkComponent = { LinkComponent }
        /  >
    ;
    ;
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
function RoleBasedNav({ items, userRoles, fallback, className = '', LinkComponent, }) {
    return items = { items };
    userPermissions = { []:  };
    userRoles = { userRoles };
    fallback = { fallback };
    className = { className };
    LinkComponent = { LinkComponent }
        /  >
    ;
    ;
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
function ResponsiveMenu({ items, breakpoint = 768, desktopVariant = 'default', mobilePosition = 'left', className = '', LinkComponent, }) {
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);
    return className = {} `responsive-menu ${className}`;
}
 >
    {}
        /  >
;
/div>;
;
/**
 * Adaptive navigation that handles overflow items
 *
 * @example
 * ```tsx
 * <AdaptiveNav items={manyMenuItems} />
 * ```
 */
function AdaptiveNav({ items, className = '', LinkComponent, }) {
    const [visibleItems, setVisibleItems] = (0, react_1.useState)(items);
    const [overflowItems, setOverflowItems] = (0, react_1.useState)([]);
    // Simplified: In production, measure actual width and calculate overflow
    (0, react_1.useEffect)(() => {
        setVisibleItems(items.slice(0, 5));
        setOverflowItems(items.slice(5));
    }, [items]);
    return className = {} `adaptive-nav ${className}`;
}
 >
    items;
{
    visibleItems;
}
orientation = "horizontal";
LinkComponent = { LinkComponent } /  >
    { overflowItems, : .length > 0 && trigger };
{
    More < /button>;
}
items = { overflowItems };
LinkComponent = { LinkComponent }
    /  >
;
/nav>;
;
/**
 * Collapsible menu component
 *
 * @example
 * ```tsx
 * <CollapsibleMenu items={menuItems} defaultCollapsed />
 * ```
 */
function CollapsibleMenu({ items, defaultCollapsed = false, className = '', LinkComponent, }) {
    const [isCollapsed, setIsCollapsed] = (0, react_1.useState)(defaultCollapsed);
    const toggle = (0, react_1.useCallback)(() => {
        setIsCollapsed((prev) => !prev);
    }, []);
    return className = {} `collapsible-menu ${isCollapsed ? 'collapsed' : ''} ${className}`;
}
 >
    className;
"collapsible-menu-toggle";
onClick = { toggle };
aria - expanded;
{
    !isCollapsed;
}
    >
        { isCollapsed, 'Expand Menu': 'Collapse Menu' }
    < /button>;
{
    !isCollapsed && items;
    {
        items;
    }
    orientation = "vertical";
    LinkComponent = { LinkComponent } /  >
    ;
}
/div>;
;
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
function MenuSearch({ items, placeholder = 'Search...', onSearch, className = '', LinkComponent, }) {
    const [query, setQuery] = (0, react_1.useState)('');
    const [results, setResults] = (0, react_1.useState)(items);
    const searchItems = (0, react_1.useCallback)((searchQuery, menuItems) => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = [];
        const search = (itemList) => {
            itemList.forEach((item) => {
                if (item.hidden)
                    return;
                const matches = item.label.toLowerCase().includes(lowerQuery) ||
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
    (0, react_1.useEffect)(() => {
        if (!query.trim()) {
            setResults(items);
            onSearch?.('', items);
            return;
        }
        const filtered = searchItems(query, items);
        setResults(filtered);
        onSearch?.(query, filtered);
    }, [query, items, searchItems, onSearch]);
    return className = {} `menu-search ${className}`;
}
 >
    type;
"search";
value = { query };
onChange = {}(e);
setQuery(e.target.value);
placeholder = { placeholder };
className = "menu-search-input";
aria - label;
"Search menu"
    /  >
    { results, : .length > 0 ? items = { results } : , orientation = "vertical", LinkComponent = { LinkComponent } /  >
     }(className, "menu-search-empty" > No, results, found < /div>);
/div>;
;
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
function QuickLinks({ items, title = 'Quick Links', max = 10, className = '', LinkComponent, }) {
    const displayItems = (0, react_1.useMemo)(() => items.slice(0, max), [items, max]);
    return className = {} `quick-links ${className}`;
}
 >
    { title } && className;
"quick-links-title" > { title } < /h3>;
items;
{
    displayItems;
}
orientation = "vertical";
size = "sm";
LinkComponent = { LinkComponent }
    /  >
    /div>;
;
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
function FavoriteLinks({ items, onToggleFavorite, className = '', LinkComponent, }) {
    const renderItem = (0, react_1.useCallback)((item, defaultRender) => {
        return className = "favorite-link-wrapper" >
            { defaultRender };
        {
            onToggleFavorite && onClick;
            {
                () => onToggleFavorite(item.id);
            }
            className = "favorite-toggle";
            aria - label;
            "Remove from favorites"
                >
            ;
        }
    });
    /button>;
}
/div>;
;
[onToggleFavorite];
;
return className = {} `favorite-links ${className}`;
 >
    className;
"favorite-links-title" > Favorites < /h3>;
{
    items.length > 0 ? items = { items }
        :
    ;
    orientation = "vertical";
    renderItem = { renderItem };
    LinkComponent = { LinkComponent }
        /  >
    ;
    className = "favorite-links-empty" > No;
    favorites;
    yet < /div>;
}
/div>;
;
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
function buildMenuHierarchy(items) {
    const itemMap = new Map();
    const rootItems = [];
    // Create map and initialize children arrays
    items.forEach((item) => {
        itemMap.set(item.id, { ...item, children: [] });
    });
    // Build hierarchy
    items.forEach((item) => {
        const menuItem = itemMap.get(item.id);
        if (!item.parentId) {
            rootItems.push(menuItem);
        }
        else {
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
function flattenMenuItems(items) {
    const flattened = [];
    const flatten = (menuItems) => {
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
function findMenuItem(items, id) {
    for (const item of items) {
        if (item.id === id)
            return item;
        if (item.children) {
            const found = findMenuItem(item.children, id);
            if (found)
                return found;
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
function getMenuItemPath(items, id) {
    const findPath = (menuItems, targetId, currentPath) => {
        for (const item of menuItems) {
            const newPath = [...currentPath, item];
            if (item.id === targetId) {
                return newPath;
            }
            if (item.children) {
                const foundPath = findPath(item.children, targetId, newPath);
                if (foundPath)
                    return foundPath;
            }
        }
        return null;
    };
    return findPath(items, id, []) || [];
}
//# sourceMappingURL=navigation-menu-kit.js.map