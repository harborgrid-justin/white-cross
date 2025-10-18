/**
 * WF-COMP-111 | ui.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./config | Dependencies: ./config
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * UI and form constants for the healthcare platform
 * Provides consistent styling, layout, and form configuration
 */

import { PAGINATION_CONFIG, UI_CONFIG } from './config';

// Component size variants
export const COMPONENT_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

// Button variants
export const BUTTON_VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  light: 'light',
  dark: 'dark',
  link: 'link',
} as const;

// Button sizes
export const BUTTON_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

// Form field variants
export const FIELD_VARIANTS = {
  default: 'default',
  filled: 'filled',
  outlined: 'outlined',
  underlined: 'underlined',
} as const;

// Color schemes for healthcare context
export const HEALTHCARE_COLORS = {
  // Status colors
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    button: 'bg-green-600 hover:bg-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    button: 'bg-yellow-600 hover:bg-yellow-700',
  },
  danger: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    button: 'bg-red-600 hover:bg-red-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    button: 'bg-blue-600 hover:bg-blue-700',
  },

  // Healthcare specific colors
  medication: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  patient: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-800',
    button: 'bg-indigo-600 hover:bg-indigo-700',
  },
  emergency: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-900',
    button: 'bg-red-700 hover:bg-red-800',
  },
} as const;

// Table configuration
export const TABLE_CONFIG = {
  defaultPageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
  pageSizeOptions: PAGINATION_CONFIG.PAGE_SIZE_OPTIONS,
  striped: true,
  bordered: false,
  hover: true,
  responsive: true,
} as const;

// Modal sizes
export const MODAL_SIZES = {
  xs: 'max-w-md',
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
} as const;

// Drawer positions
export const DRAWER_POSITIONS = {
  left: 'left-0',
  right: 'right-0',
  top: 'top-0',
  bottom: 'bottom-0',
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: UI_CONFIG.MODAL_ANIMATION_DURATION,
  slow: 300,
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Form layout options
export const FORM_LAYOUT = {
  horizontal: 'horizontal',
  vertical: 'vertical',
  inline: 'inline',
} as const;

// Field widths
export const FIELD_WIDTHS = {
  xs: 'w-20',
  sm: 'w-32',
  md: 'w-48',
  lg: 'w-64',
  xl: 'w-80',
  full: 'w-full',
} as const;

// Spacing scale
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

// Border radius values
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
} as const;

// Shadow levels
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Typography scale
export const TYPOGRAPHY = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// Loading states
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

// Loading spinner sizes
export const SPINNER_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
} as const;

// Toast positions
export const TOAST_POSITIONS = {
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
} as const;

// Toast types
export const TOAST_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

// Badge variants for healthcare
export const BADGE_VARIANTS = {
  // Status badges
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',

  // Priority badges
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900',

  // Healthcare specific badges
  allergy: 'bg-purple-100 text-purple-800',
  medication: 'bg-indigo-100 text-indigo-800',
  vaccination: 'bg-teal-100 text-teal-800',
  emergency: 'bg-red-200 text-red-900',
} as const;

// Icon sizes
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
} as const;

// Common icon mappings for healthcare
export const HEALTHCARE_ICONS = {
  patient: 'User',
  medication: 'Pill',
  vaccine: 'Shield',
  allergy: 'AlertTriangle',
  emergency: 'Phone',
  calendar: 'Calendar',
  clock: 'Clock',
  checkup: 'Stethoscope',
  growth: 'TrendingUp',
  vision: 'Eye',
  hearing: 'Ear',
  heart: 'Heart',
  brain: 'Brain',
  lungs: 'Wind',
  temperature: 'Thermometer',
  weight: 'Scale',
  height: 'Ruler',
  bloodPressure: 'Activity',
  glucose: 'Droplet',
} as const;

// Form field types
export const FIELD_TYPES = {
  text: 'text',
  email: 'email',
  password: 'password',
  number: 'number',
  tel: 'tel',
  url: 'url',
  search: 'search',
  date: 'date',
  datetime: 'datetime-local',
  time: 'time',
  select: 'select',
  multiselect: 'multiselect',
  checkbox: 'checkbox',
  radio: 'radio',
  textarea: 'textarea',
  file: 'file',
  hidden: 'hidden',
} as const;

// Form grid layouts
export const FORM_GRID = {
  cols1: 'grid-cols-1',
  cols2: 'grid-cols-2',
  cols3: 'grid-cols-3',
  cols4: 'grid-cols-4',
  cols6: 'grid-cols-6',
  cols12: 'grid-cols-12',
} as const;

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Accessibility configuration
export const A11Y = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  screenReaderOnly: 'sr-only',
  highContrast: 'contrast-more:border-black contrast-more:border-2',
} as const;

// Theme configuration
export const THEME = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  typography: TYPOGRAPHY,
} as const;

// Export comprehensive UI constants object
export const UI_CONSTANTS = {
  SIZES: COMPONENT_SIZES,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  FIELD_VARIANTS,
  COLORS: HEALTHCARE_COLORS,
  TABLE: TABLE_CONFIG,
  MODAL_SIZES,
  DRAWER_POSITIONS,
  ANIMATION_DURATIONS,
  Z_INDEX,
  FORM_LAYOUT,
  FIELD_WIDTHS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  LOADING_STATES,
  SPINNER_SIZES,
  TOAST_POSITIONS,
  TOAST_TYPES,
  BADGE_VARIANTS,
  ICON_SIZES,
  HEALTHCARE_ICONS,
  FIELD_TYPES,
  FORM_GRID,
  BREAKPOINTS,
  A11Y,
  THEME,
} as const;

export default UI_CONSTANTS;
