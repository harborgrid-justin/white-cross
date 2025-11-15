/**
 * Layout Component Definitions
 *
 * Metadata definitions for layout components that can be used in the page builder.
 * These components provide structure and spatial organization.
 */

import { ComponentDefinition } from '../types';

/**
 * Container Component
 *
 * A responsive container with max-width and padding controls
 */
export const ContainerDefinition: ComponentDefinition = {
  id: 'layout-container',
  name: 'Container',
  displayName: 'Container',
  description: 'Responsive container with max-width constraints and padding',
  category: 'layout',
  icon: 'LayoutTemplate',
  tags: ['layout', 'container', 'wrapper', 'responsive'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Container',

  acceptsChildren: true,
  minChildren: 0,

  props: [
    {
      name: 'maxWidth',
      label: 'Max Width',
      description: 'Maximum width of the container',
      type: 'string',
      controlType: 'select',
      defaultValue: 'lg',
      options: [
        { value: 'sm', label: 'Small (640px)' },
        { value: 'md', label: 'Medium (768px)' },
        { value: 'lg', label: 'Large (1024px)' },
        { value: 'xl', label: 'Extra Large (1280px)' },
        { value: '2xl', label: '2XL (1536px)' },
        { value: 'full', label: 'Full Width' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'padding',
      label: 'Padding',
      description: 'Internal padding',
      type: 'object',
      controlType: 'spacing',
      defaultValue: { all: '1rem' },
      sides: ['all', 'top', 'right', 'bottom', 'left'],
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'centered',
      label: 'Center Content',
      description: 'Center the container horizontally',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'layout',
    },
    {
      name: 'fluid',
      label: 'Fluid',
      description: 'Full width container without max-width',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'layout',
    },
  ],

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'bordered', label: 'Bordered' },
          { value: 'elevated', label: 'Elevated' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Container',
    keyboardNavigable: false,
  },

  previewProps: {
    maxWidth: 'lg',
    padding: { all: '1rem' },
    centered: true,
  },
};

/**
 * Grid Component
 *
 * CSS Grid layout with configurable columns, rows, and gap
 */
export const GridDefinition: ComponentDefinition = {
  id: 'layout-grid',
  name: 'Grid',
  displayName: 'Grid',
  description: 'CSS Grid layout with flexible configuration',
  category: 'layout',
  icon: 'Grid3x3',
  tags: ['layout', 'grid', 'columns', 'responsive'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Grid',

  acceptsChildren: true,
  minChildren: 0,

  props: [
    {
      name: 'columns',
      label: 'Columns',
      description: 'Number of columns or template',
      type: 'number',
      controlType: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'rows',
      label: 'Rows',
      description: 'Number of rows or template',
      type: 'number',
      controlType: 'number',
      defaultValue: undefined,
      min: 1,
      max: 12,
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'gap',
      label: 'Gap',
      description: 'Gap between grid items',
      type: 'string',
      controlType: 'slider',
      defaultValue: '1rem',
      min: 0,
      max: 4,
      step: 0.25,
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'columnGap',
      label: 'Column Gap',
      description: 'Gap between columns',
      type: 'string',
      controlType: 'slider',
      defaultValue: undefined,
      min: 0,
      max: 4,
      step: 0.25,
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'rowGap',
      label: 'Row Gap',
      description: 'Gap between rows',
      type: 'string',
      controlType: 'slider',
      defaultValue: undefined,
      min: 0,
      max: 4,
      step: 0.25,
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'autoFlow',
      label: 'Auto Flow',
      description: 'Grid auto-flow direction',
      type: 'string',
      controlType: 'select',
      defaultValue: 'row',
      options: [
        { value: 'row', label: 'Row' },
        { value: 'column', label: 'Column' },
        { value: 'dense', label: 'Dense' },
        { value: 'row-dense', label: 'Row Dense' },
        { value: 'column-dense', label: 'Column Dense' },
      ],
      group: 'layout',
    },
    {
      name: 'autoFit',
      label: 'Auto Fit',
      description: 'Auto-fit columns to available space',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'layout',
    },
    {
      name: 'autoFill',
      label: 'Auto Fill',
      description: 'Auto-fill columns to available space',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: false,
      group: 'layout',
    },
    {
      name: 'minColumnWidth',
      label: 'Min Column Width',
      description: 'Minimum width of columns (for auto-fit/fill)',
      type: 'string',
      controlType: 'text',
      defaultValue: '200px',
      placeholder: '200px',
      group: 'layout',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Grid layout',
    keyboardNavigable: false,
  },

  previewProps: {
    columns: 3,
    gap: '1rem',
  },
};

/**
 * Flex Component
 *
 * Flexbox layout with full control over flex properties
 */
export const FlexDefinition: ComponentDefinition = {
  id: 'layout-flex',
  name: 'Flex',
  displayName: 'Flex',
  description: 'Flexbox layout with flexible configuration',
  category: 'layout',
  icon: 'FlipHorizontal',
  tags: ['layout', 'flex', 'flexbox', 'responsive'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Flex',

  acceptsChildren: true,
  minChildren: 0,

  props: [
    {
      name: 'direction',
      label: 'Direction',
      description: 'Flex direction',
      type: 'string',
      controlType: 'select',
      defaultValue: 'row',
      options: [
        { value: 'row', label: 'Row', icon: 'ArrowRight' },
        { value: 'column', label: 'Column', icon: 'ArrowDown' },
        { value: 'row-reverse', label: 'Row Reverse', icon: 'ArrowLeft' },
        { value: 'column-reverse', label: 'Column Reverse', icon: 'ArrowUp' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'wrap',
      label: 'Wrap',
      description: 'Flex wrap behavior',
      type: 'string',
      controlType: 'select',
      defaultValue: 'nowrap',
      options: [
        { value: 'nowrap', label: 'No Wrap' },
        { value: 'wrap', label: 'Wrap' },
        { value: 'wrap-reverse', label: 'Wrap Reverse' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'alignItems',
      label: 'Align Items',
      description: 'Cross-axis alignment',
      type: 'string',
      controlType: 'select',
      defaultValue: 'start',
      options: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
        { value: 'baseline', label: 'Baseline' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'justifyContent',
      label: 'Justify Content',
      description: 'Main-axis alignment',
      type: 'string',
      controlType: 'select',
      defaultValue: 'start',
      options: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'between', label: 'Space Between' },
        { value: 'around', label: 'Space Around' },
        { value: 'evenly', label: 'Space Evenly' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'gap',
      label: 'Gap',
      description: 'Gap between flex items',
      type: 'string',
      controlType: 'slider',
      defaultValue: '0.5rem',
      min: 0,
      max: 4,
      step: 0.25,
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Flex container',
    keyboardNavigable: false,
  },

  previewProps: {
    direction: 'row',
    gap: '0.5rem',
    alignItems: 'center',
  },
};

/**
 * Stack Component
 *
 * Simple vertical or horizontal stacking with consistent spacing
 */
export const StackDefinition: ComponentDefinition = {
  id: 'layout-stack',
  name: 'Stack',
  displayName: 'Stack',
  description: 'Simple vertical or horizontal stacking with consistent spacing',
  category: 'layout',
  icon: 'Layers',
  tags: ['layout', 'stack', 'spacing', 'vertical', 'horizontal'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Stack',

  acceptsChildren: true,
  minChildren: 0,

  props: [
    {
      name: 'orientation',
      label: 'Orientation',
      description: 'Stack direction',
      type: 'string',
      controlType: 'select',
      defaultValue: 'vertical',
      options: [
        { value: 'vertical', label: 'Vertical', icon: 'ArrowDown' },
        { value: 'horizontal', label: 'Horizontal', icon: 'ArrowRight' },
      ],
      group: 'layout',
      supportsResponsive: true,
    },
    {
      name: 'spacing',
      label: 'Spacing',
      description: 'Space between items',
      type: 'string',
      controlType: 'slider',
      defaultValue: '1rem',
      min: 0,
      max: 4,
      step: 0.25,
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'align',
      label: 'Alignment',
      description: 'Item alignment',
      type: 'string',
      controlType: 'select',
      defaultValue: 'start',
      options: [
        { value: 'start', label: 'Start' },
        { value: 'center', label: 'Center' },
        { value: 'end', label: 'End' },
        { value: 'stretch', label: 'Stretch' },
      ],
      group: 'layout',
      supportsResponsive: true,
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
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Stack container',
    keyboardNavigable: false,
  },

  previewProps: {
    orientation: 'vertical',
    spacing: '1rem',
  },
};

/**
 * Section Component
 *
 * Semantic section element with padding and background options
 */
export const SectionDefinition: ComponentDefinition = {
  id: 'layout-section',
  name: 'Section',
  displayName: 'Section',
  description: 'Semantic section element with padding and background',
  category: 'layout',
  icon: 'Square',
  tags: ['layout', 'section', 'semantic', 'container'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/ui/Section',

  acceptsChildren: true,
  minChildren: 0,

  props: [
    {
      name: 'padding',
      label: 'Padding',
      description: 'Section padding',
      type: 'object',
      controlType: 'spacing',
      defaultValue: { top: '2rem', bottom: '2rem' },
      sides: ['top', 'right', 'bottom', 'left'],
      unit: 'rem',
      group: 'spacing',
      supportsResponsive: true,
    },
    {
      name: 'background',
      label: 'Background',
      description: 'Background color or gradient',
      type: 'string',
      controlType: 'color',
      defaultValue: 'transparent',
      group: 'appearance',
      opacity: true,
    },
    {
      name: 'fullWidth',
      label: 'Full Width',
      description: 'Extend to full viewport width',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'layout',
    },
  ],

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'region',
    keyboardNavigable: false,
  },

  previewProps: {
    padding: { top: '2rem', bottom: '2rem' },
    fullWidth: true,
  },
};

// Export all layout component definitions
export const LayoutComponents: ComponentDefinition[] = [
  ContainerDefinition,
  GridDefinition,
  FlexDefinition,
  StackDefinition,
  SectionDefinition,
];
