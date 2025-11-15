/**
 * Navigation Component Definitions
 *
 * Metadata definitions for navigation components including navbars,
 * sidebars, breadcrumbs, and tabs.
 */

import { ComponentDefinition } from '../types';

/**
 * Navbar Component
 *
 * Top navigation bar with logo, links, and mobile menu
 */
export const NavbarDefinition: ComponentDefinition = {
  id: 'nav-navbar',
  name: 'Navbar',
  displayName: 'Navigation Bar',
  description: 'Top navigation bar with logo, links, and responsive mobile menu',
  category: 'navigation',
  icon: 'Navigation',
  tags: ['navigation', 'nav', 'header', 'menu', 'mobile'],

  renderMode: 'client', // Needs interactivity for mobile menu
  componentPath: '@/lib/page-builder/ui/Navbar',

  acceptsChildren: false,

  props: [
    {
      name: 'logo',
      label: 'Logo',
      description: 'Logo image or text',
      type: 'object',
      controlType: 'json',
      defaultValue: { type: 'text', content: 'Logo' },
      group: 'branding',
    },
    {
      name: 'logoUrl',
      label: 'Logo URL',
      description: 'Link for logo click',
      type: 'string',
      controlType: 'url',
      defaultValue: '/',
      group: 'branding',
    },
    {
      name: 'links',
      label: 'Navigation Links',
      description: 'Navigation menu items',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'actions',
      label: 'Action Buttons',
      description: 'Right-aligned action buttons',
      type: 'array',
      controlType: 'json',
      defaultValue: [],
      group: 'content',
    },
    {
      name: 'sticky',
      label: 'Sticky',
      description: 'Stick to top on scroll',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
    {
      name: 'transparent',
      label: 'Transparent',
      description: 'Transparent background',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'blur',
      label: 'Blur Background',
      description: 'Blur background when sticky',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'mobileBreakpoint',
      label: 'Mobile Breakpoint',
      description: 'Breakpoint for mobile menu',
      type: 'string',
      controlType: 'select',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small (640px)' },
        { value: 'md', label: 'Medium (768px)' },
        { value: 'lg', label: 'Large (1024px)' },
      ],
      group: 'responsive',
    },
  ],

  events: [
    { name: 'onLinkClick', label: 'Link Click', description: 'Triggered when a navigation link is clicked' },
    { name: 'onLogoClick', label: 'Logo Click', description: 'Triggered when logo is clicked' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'bordered', label: 'Bordered' },
          { value: 'floating', label: 'Floating' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'navigation',
    defaultAriaLabel: 'Main navigation',
    keyboardNavigable: true,
  },

  previewProps: {
    logo: { type: 'text', content: 'Logo' },
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
  },
};

/**
 * Sidebar Component
 *
 * Side navigation with collapsible sections
 */
export const SidebarDefinition: ComponentDefinition = {
  id: 'nav-sidebar',
  name: 'Sidebar',
  displayName: 'Sidebar',
  description: 'Side navigation with collapsible sections and icons',
  category: 'navigation',
  icon: 'PanelLeft',
  tags: ['navigation', 'sidebar', 'menu', 'collapsible'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Sidebar',

  acceptsChildren: false,

  props: [
    {
      name: 'items',
      label: 'Navigation Items',
      description: 'Sidebar navigation items',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { label: 'Dashboard', icon: 'Home', href: '/dashboard' },
        { label: 'Settings', icon: 'Settings', href: '/settings' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'position',
      label: 'Position',
      description: 'Sidebar position',
      type: 'string',
      controlType: 'select',
      defaultValue: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      group: 'layout',
    },
    {
      name: 'collapsible',
      label: 'Collapsible',
      description: 'Allow sidebar to collapse',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
    {
      name: 'defaultCollapsed',
      label: 'Default Collapsed',
      description: 'Start collapsed',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
      condition: 'collapsible === true',
    },
    {
      name: 'width',
      label: 'Width',
      description: 'Sidebar width when expanded',
      type: 'string',
      controlType: 'slider',
      defaultValue: '16rem',
      min: 12,
      max: 24,
      step: 1,
      unit: 'rem',
      group: 'layout',
    },
    {
      name: 'collapsedWidth',
      label: 'Collapsed Width',
      description: 'Sidebar width when collapsed',
      type: 'string',
      controlType: 'slider',
      defaultValue: '4rem',
      min: 3,
      max: 8,
      step: 0.5,
      unit: 'rem',
      group: 'layout',
      condition: 'collapsible === true',
    },
    {
      name: 'showHeader',
      label: 'Show Header',
      description: 'Show sidebar header',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'content',
    },
    {
      name: 'headerContent',
      label: 'Header Content',
      description: 'Content for sidebar header',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Menu',
      group: 'content',
      condition: 'showHeader === true',
    },
  ],

  events: [
    { name: 'onItemClick', label: 'Item Click', description: 'Triggered when sidebar item is clicked' },
    { name: 'onToggle', label: 'Toggle', description: 'Triggered when sidebar is collapsed/expanded' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'bordered', label: 'Bordered' },
          { value: 'floating', label: 'Floating' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'navigation',
    defaultAriaLabel: 'Sidebar navigation',
    keyboardNavigable: true,
  },

  previewProps: {
    items: [
      { label: 'Dashboard', icon: 'Home', href: '/dashboard' },
      { label: 'Settings', icon: 'Settings', href: '/settings' },
    ],
    collapsible: true,
  },
};

/**
 * Breadcrumbs Component
 *
 * Navigation breadcrumb trail
 */
export const BreadcrumbsDefinition: ComponentDefinition = {
  id: 'nav-breadcrumbs',
  name: 'Breadcrumbs',
  displayName: 'Breadcrumbs',
  description: 'Navigation breadcrumb trail showing page hierarchy',
  category: 'navigation',
  icon: 'ChevronRight',
  tags: ['navigation', 'breadcrumbs', 'trail', 'hierarchy'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Breadcrumbs',

  acceptsChildren: false,

  props: [
    {
      name: 'items',
      label: 'Breadcrumb Items',
      description: 'Breadcrumb trail items',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { label: 'Home', href: '/' },
        { label: 'Category', href: '/category' },
        { label: 'Current Page' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'separator',
      label: 'Separator',
      description: 'Separator between items',
      type: 'string',
      controlType: 'select',
      defaultValue: 'chevron',
      options: [
        { value: 'chevron', label: 'Chevron (>)' },
        { value: 'slash', label: 'Slash (/)' },
        { value: 'dot', label: 'Dot (•)' },
        { value: 'arrow', label: 'Arrow (→)' },
      ],
      group: 'appearance',
    },
    {
      name: 'showHome',
      label: 'Show Home Icon',
      description: 'Show home icon for first item',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'maxItems',
      label: 'Max Items',
      description: 'Maximum items to show (collapse middle items)',
      type: 'number',
      controlType: 'number',
      defaultValue: undefined,
      min: 2,
      max: 10,
      group: 'behavior',
    },
  ],

  dataBindings: [
    {
      prop: 'items',
      label: 'Breadcrumb Items',
      supportedSources: ['state', 'props', 'url', 'computed'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'navigation',
    defaultAriaLabel: 'Breadcrumb',
    keyboardNavigable: true,
  },

  previewProps: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Details' },
    ],
  },
};

/**
 * Tabs Component
 *
 * Tabbed interface for content organization
 */
export const TabsDefinition: ComponentDefinition = {
  id: 'nav-tabs',
  name: 'Tabs',
  displayName: 'Tabs',
  description: 'Tabbed interface for organizing content',
  category: 'navigation',
  icon: 'FolderTabs',
  tags: ['navigation', 'tabs', 'tabbed', 'content'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Tabs',

  acceptsChildren: true,
  childrenTypes: ['nav-tab-panel'],

  props: [
    {
      name: 'tabs',
      label: 'Tab Items',
      description: 'Tab configuration',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { id: 'tab1', label: 'Tab 1', icon: undefined },
        { id: 'tab2', label: 'Tab 2', icon: undefined },
      ],
      group: 'content',
    },
    {
      name: 'defaultTab',
      label: 'Default Tab',
      description: 'Initially active tab',
      type: 'string',
      controlType: 'text',
      defaultValue: 'tab1',
      group: 'behavior',
    },
    {
      name: 'orientation',
      label: 'Orientation',
      description: 'Tab list orientation',
      type: 'string',
      controlType: 'select',
      defaultValue: 'horizontal',
      options: [
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'vertical', label: 'Vertical' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'variant',
      label: 'Variant',
      description: 'Tab visual style',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'pills', label: 'Pills' },
        { value: 'underline', label: 'Underline' },
        { value: 'bordered', label: 'Bordered' },
      ],
      group: 'appearance',
    },
    {
      name: 'keepMounted',
      label: 'Keep Mounted',
      description: 'Keep inactive tabs mounted in DOM',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'lazy',
      label: 'Lazy Load',
      description: 'Lazy load tab content',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onTabChange', label: 'Tab Change', description: 'Triggered when tab changes' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'size',
        label: 'Size',
        values: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'tablist',
    keyboardNavigable: true,
    requiredAriaAttributes: ['aria-label'],
  },

  previewProps: {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ],
    defaultTab: 'tab1',
  },
};

/**
 * Pagination Component
 *
 * Pagination controls for navigating pages
 */
export const PaginationDefinition: ComponentDefinition = {
  id: 'nav-pagination',
  name: 'Pagination',
  displayName: 'Pagination',
  description: 'Pagination controls for navigating through pages',
  category: 'navigation',
  icon: 'ChevronLeftRight',
  tags: ['navigation', 'pagination', 'pages'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Pagination',

  acceptsChildren: false,

  props: [
    {
      name: 'totalPages',
      label: 'Total Pages',
      description: 'Total number of pages',
      type: 'number',
      controlType: 'number',
      defaultValue: 10,
      min: 1,
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'currentPage',
      label: 'Current Page',
      description: 'Currently active page',
      type: 'number',
      controlType: 'number',
      defaultValue: 1,
      min: 1,
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'showFirstLast',
      label: 'Show First/Last',
      description: 'Show first and last page buttons',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'showPrevNext',
      label: 'Show Prev/Next',
      description: 'Show previous and next buttons',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'siblingCount',
      label: 'Sibling Count',
      description: 'Number of pages to show on each side',
      type: 'number',
      controlType: 'number',
      defaultValue: 1,
      min: 0,
      max: 3,
      group: 'appearance',
    },
  ],

  events: [
    { name: 'onPageChange', label: 'Page Change', description: 'Triggered when page changes' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'outlined', label: 'Outlined' },
          { value: 'text', label: 'Text' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'navigation',
    defaultAriaLabel: 'Pagination',
    keyboardNavigable: true,
  },

  previewProps: {
    totalPages: 10,
    currentPage: 1,
  },
};

// Export all navigation component definitions
export const NavigationComponents: ComponentDefinition[] = [
  NavbarDefinition,
  SidebarDefinition,
  BreadcrumbsDefinition,
  TabsDefinition,
  PaginationDefinition,
];
