/**
 * Data Display Component Definitions
 *
 * Metadata definitions for components that display data including
 * tables, lists, cards, and badges.
 */

import { ComponentDefinition } from '../types';

/**
 * Table Component
 *
 * Data table with sorting, pagination, and selection
 */
export const TableDefinition: ComponentDefinition = {
  id: 'data-table',
  name: 'Table',
  displayName: 'Table',
  description: 'Data table with sorting, filtering, pagination, and selection',
  category: 'data-display',
  icon: 'Table',
  tags: ['data', 'table', 'grid', 'list'],

  renderMode: 'client',
  componentPath: '@/lib/page-builder/ui/Table',

  acceptsChildren: false,

  props: [
    {
      name: 'columns',
      label: 'Columns',
      description: 'Table column definitions',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
      ],
      group: 'content',
      required: true,
    },
    {
      name: 'data',
      label: 'Data',
      description: 'Table data rows',
      type: 'array',
      controlType: 'json',
      defaultValue: [],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'sortable',
      label: 'Sortable',
      description: 'Enable column sorting',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'features',
    },
    {
      name: 'filterable',
      label: 'Filterable',
      description: 'Enable column filtering',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'features',
    },
    {
      name: 'searchable',
      label: 'Searchable',
      description: 'Enable global search',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'features',
    },
    {
      name: 'paginated',
      label: 'Paginated',
      description: 'Enable pagination',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'features',
    },
    {
      name: 'pageSize',
      label: 'Page Size',
      description: 'Rows per page',
      type: 'number',
      controlType: 'number',
      defaultValue: 10,
      min: 5,
      max: 100,
      step: 5,
      group: 'features',
      condition: 'paginated === true',
    },
    {
      name: 'selectable',
      label: 'Selectable',
      description: 'Enable row selection',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'features',
    },
    {
      name: 'multiSelect',
      label: 'Multi-Select',
      description: 'Allow multiple row selection',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'features',
      condition: 'selectable === true',
    },
    {
      name: 'striped',
      label: 'Striped Rows',
      description: 'Alternate row colors',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'hoverable',
      label: 'Hoverable',
      description: 'Highlight row on hover',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'bordered',
      label: 'Bordered',
      description: 'Show cell borders',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'compact',
      label: 'Compact',
      description: 'Reduce cell padding',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
  ],

  events: [
    { name: 'onRowClick', label: 'Row Click', description: 'Triggered when row is clicked' },
    { name: 'onSort', label: 'Sort', description: 'Triggered when column is sorted' },
    { name: 'onSelect', label: 'Select', description: 'Triggered when rows are selected' },
    { name: 'onPageChange', label: 'Page Change', description: 'Triggered when page changes' },
  ],

  dataBindings: [
    {
      prop: 'data',
      label: 'Data',
      supportedSources: ['state', 'props', 'api', 'computed'],
    },
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
    role: 'table',
    keyboardNavigable: true,
  },

  previewProps: {
    columns: [
      { key: 'id', label: 'ID', sortable: true },
      { key: 'name', label: 'Name', sortable: true },
      { key: 'status', label: 'Status', sortable: true },
    ],
    data: [
      { id: 1, name: 'Item 1', status: 'Active' },
      { id: 2, name: 'Item 2', status: 'Pending' },
    ],
  },
};

/**
 * List Component
 *
 * Versatile list component with various layouts
 */
export const ListDefinition: ComponentDefinition = {
  id: 'data-list',
  name: 'List',
  displayName: 'List',
  description: 'Versatile list component with various layouts and styles',
  category: 'data-display',
  icon: 'List',
  tags: ['data', 'list', 'items'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/List',

  acceptsChildren: false,

  props: [
    {
      name: 'items',
      label: 'Items',
      description: 'List items',
      type: 'array',
      controlType: 'json',
      defaultValue: [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
      ],
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'variant',
      label: 'Variant',
      description: 'List variant',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'ordered', label: 'Ordered (1, 2, 3)' },
        { value: 'unordered', label: 'Unordered (Bullets)' },
        { value: 'description', label: 'Description List' },
      ],
      group: 'appearance',
    },
    {
      name: 'divider',
      label: 'Show Dividers',
      description: 'Show dividers between items',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'spacing',
      label: 'Spacing',
      description: 'Space between items',
      type: 'string',
      controlType: 'select',
      defaultValue: 'md',
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
      group: 'appearance',
    },
    {
      name: 'clickable',
      label: 'Clickable Items',
      description: 'Make items clickable',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
    {
      name: 'showIcon',
      label: 'Show Icons',
      description: 'Display icons for items',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
  ],

  events: [
    { name: 'onItemClick', label: 'Item Click', description: 'Triggered when item is clicked' },
  ],

  dataBindings: [
    {
      prop: 'items',
      label: 'Items',
      supportedSources: ['state', 'props', 'api', 'computed'],
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'list',
    keyboardNavigable: true,
  },

  previewProps: {
    items: [
      { id: 1, label: 'First item' },
      { id: 2, label: 'Second item' },
      { id: 3, label: 'Third item' },
    ],
  },
};

/**
 * Card Component
 *
 * Card with header, content, and footer
 */
export const CardDefinition: ComponentDefinition = {
  id: 'data-card',
  name: 'Card',
  displayName: 'Card',
  description: 'Card component with header, content, and footer sections',
  category: 'data-display',
  icon: 'SquareStack',
  tags: ['data', 'card', 'container', 'panel'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Card',

  acceptsChildren: true,
  childrenTypes: ['card-header', 'card-content', 'card-footer'],

  props: [
    {
      name: 'title',
      label: 'Title',
      description: 'Card title',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Card Title',
      group: 'content',
    },
    {
      name: 'description',
      label: 'Description',
      description: 'Card description',
      type: 'string',
      controlType: 'text',
      defaultValue: '',
      group: 'content',
    },
    {
      name: 'image',
      label: 'Image',
      description: 'Card image URL',
      type: 'string',
      controlType: 'image',
      defaultValue: '',
      group: 'content',
    },
    {
      name: 'imagePosition',
      label: 'Image Position',
      description: 'Position of card image',
      type: 'string',
      controlType: 'select',
      defaultValue: 'top',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      group: 'layout',
      condition: 'image !== ""',
    },
    {
      name: 'hoverable',
      label: 'Hoverable',
      description: 'Lift on hover',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'clickable',
      label: 'Clickable',
      description: 'Make entire card clickable',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onClick', label: 'Click', description: 'Triggered when card is clicked' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'outlined', label: 'Outlined' },
          { value: 'elevated', label: 'Elevated' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    title: 'Card Title',
    description: 'This is a card description',
  },
};

/**
 * Badge Component
 *
 * Small badge or label for status indicators
 */
export const BadgeDefinition: ComponentDefinition = {
  id: 'data-badge',
  name: 'Badge',
  displayName: 'Badge',
  description: 'Small badge or label for status and counts',
  category: 'data-display',
  icon: 'Tag',
  tags: ['data', 'badge', 'label', 'status', 'tag'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Badge',

  acceptsChildren: false,

  props: [
    {
      name: 'content',
      label: 'Content',
      description: 'Badge text content',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Badge',
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'variant',
      label: 'Variant',
      description: 'Badge variant',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'danger', label: 'Danger' },
        { value: 'info', label: 'Info' },
      ],
      group: 'appearance',
    },
    {
      name: 'size',
      label: 'Size',
      description: 'Badge size',
      type: 'string',
      controlType: 'select',
      defaultValue: 'md',
      options: [
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
      ],
      group: 'appearance',
    },
    {
      name: 'shape',
      label: 'Shape',
      description: 'Badge shape',
      type: 'string',
      controlType: 'select',
      defaultValue: 'rounded',
      options: [
        { value: 'rounded', label: 'Rounded' },
        { value: 'square', label: 'Square' },
        { value: 'pill', label: 'Pill' },
      ],
      group: 'appearance',
    },
    {
      name: 'icon',
      label: 'Icon',
      description: 'Badge icon',
      type: 'string',
      controlType: 'icon',
      defaultValue: '',
      group: 'content',
    },
    {
      name: 'iconPosition',
      label: 'Icon Position',
      description: 'Position of icon',
      type: 'string',
      controlType: 'select',
      defaultValue: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      group: 'appearance',
      condition: 'icon !== ""',
    },
    {
      name: 'removable',
      label: 'Removable',
      description: 'Show remove button',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onClick', label: 'Click', description: 'Triggered when badge is clicked' },
    { name: 'onRemove', label: 'Remove', description: 'Triggered when remove button is clicked' },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    keyboardNavigable: true,
  },

  previewProps: {
    content: 'New',
    variant: 'primary',
  },
};

/**
 * Avatar Component
 *
 * User avatar with image or initials
 */
export const AvatarDefinition: ComponentDefinition = {
  id: 'data-avatar',
  name: 'Avatar',
  displayName: 'Avatar',
  description: 'User avatar with image, initials, or icon',
  category: 'data-display',
  icon: 'User',
  tags: ['data', 'avatar', 'profile', 'user'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Avatar',

  acceptsChildren: false,

  props: [
    {
      name: 'src',
      label: 'Image URL',
      description: 'Avatar image URL',
      type: 'string',
      controlType: 'image',
      defaultValue: '',
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'alt',
      label: 'Alt Text',
      description: 'Image alt text',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Avatar',
      group: 'content',
    },
    {
      name: 'fallback',
      label: 'Fallback',
      description: 'Fallback text (initials)',
      type: 'string',
      controlType: 'text',
      defaultValue: 'AB',
      group: 'content',
    },
    {
      name: 'size',
      label: 'Size',
      description: 'Avatar size',
      type: 'string',
      controlType: 'select',
      defaultValue: 'md',
      options: [
        { value: 'xs', label: 'Extra Small' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      group: 'appearance',
    },
    {
      name: 'shape',
      label: 'Shape',
      description: 'Avatar shape',
      type: 'string',
      controlType: 'select',
      defaultValue: 'circle',
      options: [
        { value: 'circle', label: 'Circle' },
        { value: 'square', label: 'Square' },
        { value: 'rounded', label: 'Rounded' },
      ],
      group: 'appearance',
    },
    {
      name: 'showBadge',
      label: 'Show Badge',
      description: 'Show status badge',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'appearance',
    },
    {
      name: 'badgeStatus',
      label: 'Badge Status',
      description: 'Status badge color',
      type: 'string',
      controlType: 'select',
      defaultValue: 'online',
      options: [
        { value: 'online', label: 'Online (Green)' },
        { value: 'offline', label: 'Offline (Gray)' },
        { value: 'away', label: 'Away (Yellow)' },
        { value: 'busy', label: 'Busy (Red)' },
      ],
      group: 'appearance',
      condition: 'showBadge === true',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'User avatar',
  },

  previewProps: {
    fallback: 'JD',
    size: 'md',
    shape: 'circle',
  },
};

/**
 * Alert Component
 *
 * Alert message with various severity levels
 */
export const AlertDefinition: ComponentDefinition = {
  id: 'data-alert',
  name: 'Alert',
  displayName: 'Alert',
  description: 'Alert message with various severity levels',
  category: 'data-display',
  icon: 'AlertCircle',
  tags: ['data', 'alert', 'notification', 'message'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Alert',

  acceptsChildren: true,

  props: [
    {
      name: 'title',
      label: 'Title',
      description: 'Alert title',
      type: 'string',
      controlType: 'text',
      defaultValue: 'Alert',
      group: 'content',
    },
    {
      name: 'message',
      label: 'Message',
      description: 'Alert message',
      type: 'string',
      controlType: 'text',
      defaultValue: 'This is an alert message.',
      group: 'content',
      supportsDataBinding: true,
    },
    {
      name: 'variant',
      label: 'Variant',
      description: 'Alert severity level',
      type: 'string',
      controlType: 'select',
      defaultValue: 'info',
      options: [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
      ],
      group: 'appearance',
    },
    {
      name: 'showIcon',
      label: 'Show Icon',
      description: 'Show severity icon',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'appearance',
    },
    {
      name: 'dismissible',
      label: 'Dismissible',
      description: 'Show close button',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'behavior',
    },
  ],

  events: [
    { name: 'onClose', label: 'Close', description: 'Triggered when alert is dismissed' },
  ],

  styleOptions: {
    variants: [
      {
        name: 'layout',
        label: 'Layout',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'bordered', label: 'Bordered' },
          { value: 'filled', label: 'Filled' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'alert',
    defaultAriaLabel: 'Alert message',
  },

  previewProps: {
    title: 'Success',
    message: 'Your changes have been saved.',
    variant: 'success',
  },
};

// Export all data display component definitions
export const DataDisplayComponents: ComponentDefinition[] = [
  TableDefinition,
  ListDefinition,
  CardDefinition,
  BadgeDefinition,
  AvatarDefinition,
  AlertDefinition,
];
