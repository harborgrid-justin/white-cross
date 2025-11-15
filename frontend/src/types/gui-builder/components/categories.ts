/**
 * Component Categories and Classification
 *
 * This module defines the categorization system for components,
 * enabling organization, filtering, and discovery of components.
 *
 * @module gui-builder/components/categories
 */

/**
 * Primary component categories.
 */
export enum ComponentCategory {
  /**
   * Layout components (containers, grids, sections).
   */
  Layout = 'layout',

  /**
   * Form inputs and controls.
   */
  Form = 'form',

  /**
   * Display and typography components.
   */
  Display = 'display',

  /**
   * Navigation components (menus, breadcrumbs, tabs).
   */
  Navigation = 'navigation',

  /**
   * Data visualization (charts, tables, lists).
   */
  DataVisualization = 'data-visualization',

  /**
   * Media components (images, videos, galleries).
   */
  Media = 'media',

  /**
   * Interactive elements (buttons, links, modals).
   */
  Interactive = 'interactive',

  /**
   * Feedback components (alerts, toasts, notifications).
   */
  Feedback = 'feedback',

  /**
   * Custom or user-defined components.
   */
  Custom = 'custom',
}

/**
 * Subcategories for more granular classification.
 */
export interface ComponentSubcategory {
  /**
   * Unique identifier for the subcategory.
   */
  readonly id: string;

  /**
   * Display name for the subcategory.
   */
  readonly name: string;

  /**
   * Parent category this belongs to.
   */
  readonly category: ComponentCategory;

  /**
   * Optional description.
   */
  readonly description?: string;

  /**
   * Icon identifier for UI display.
   */
  readonly icon?: string;
}

/**
 * Common subcategories for layout components.
 */
export const LayoutSubcategories = {
  Container: {
    id: 'container',
    name: 'Container',
    category: ComponentCategory.Layout,
    description: 'Generic container components',
  },
  Grid: {
    id: 'grid',
    name: 'Grid',
    category: ComponentCategory.Layout,
    description: 'Grid layout components',
  },
  Flex: {
    id: 'flex',
    name: 'Flex',
    category: ComponentCategory.Layout,
    description: 'Flexbox layout components',
  },
  Section: {
    id: 'section',
    name: 'Section',
    category: ComponentCategory.Layout,
    description: 'Page section components',
  },
  Stack: {
    id: 'stack',
    name: 'Stack',
    category: ComponentCategory.Layout,
    description: 'Stack layout components',
  },
} as const;

/**
 * Common subcategories for form components.
 */
export const FormSubcategories = {
  Input: {
    id: 'input',
    name: 'Input',
    category: ComponentCategory.Form,
    description: 'Text and number inputs',
  },
  Select: {
    id: 'select',
    name: 'Select',
    category: ComponentCategory.Form,
    description: 'Dropdown and select inputs',
  },
  Checkbox: {
    id: 'checkbox',
    name: 'Checkbox',
    category: ComponentCategory.Form,
    description: 'Checkbox and radio inputs',
  },
  DatePicker: {
    id: 'date-picker',
    name: 'Date Picker',
    category: ComponentCategory.Form,
    description: 'Date and time selection',
  },
  FileUpload: {
    id: 'file-upload',
    name: 'File Upload',
    category: ComponentCategory.Form,
    description: 'File upload components',
  },
} as const;

/**
 * Component complexity level.
 */
export enum ComponentComplexity {
  /**
   * Simple, atomic components (button, input).
   */
  Simple = 'simple',

  /**
   * Moderate complexity (form, card).
   */
  Moderate = 'moderate',

  /**
   * Complex, composite components (data table, wizard).
   */
  Complex = 'complex',

  /**
   * Advanced components with significant logic (editor, builder).
   */
  Advanced = 'advanced',
}

/**
 * Component maturity and stability level.
 */
export enum ComponentMaturity {
  /**
   * Experimental, may change significantly.
   */
  Experimental = 'experimental',

  /**
   * In development, API may still change.
   */
  Beta = 'beta',

  /**
   * Stable, production-ready.
   */
  Stable = 'stable',

  /**
   * Deprecated, will be removed.
   */
  Deprecated = 'deprecated',
}

/**
 * Taxonomy for component classification.
 */
export interface ComponentTaxonomy {
  /**
   * Primary category.
   */
  readonly category: ComponentCategory;

  /**
   * Optional subcategory.
   */
  readonly subcategory?: string;

  /**
   * Additional tags for filtering.
   */
  readonly tags?: readonly string[];

  /**
   * Complexity level.
   */
  readonly complexity?: ComponentComplexity;

  /**
   * Maturity level.
   */
  readonly maturity?: ComponentMaturity;
}

/**
 * Predefined component tags.
 */
export const ComponentTags = {
  Responsive: 'responsive',
  Accessible: 'accessible',
  Interactive: 'interactive',
  Animated: 'animated',
  ServerComponent: 'server-component',
  ClientComponent: 'client-component',
  Form: 'form',
  DataDriven: 'data-driven',
  Themeable: 'themeable',
  Premium: 'premium',
} as const;

/**
 * Type for valid component tags.
 */
export type ComponentTag = (typeof ComponentTags)[keyof typeof ComponentTags];
