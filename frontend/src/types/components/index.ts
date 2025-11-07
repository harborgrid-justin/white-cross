/**
 * Component Type Definitions
 *
 * Common type definitions for React components, props, and component patterns.
 *
 * @module types/components
 */

import { ComponentType, ReactNode, ReactElement, CSSProperties } from 'react';

/**
 * Base component props that all components can accept
 */
export interface BaseComponentProps {
  /**
   * CSS class name
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Component ID
   */
  id?: string;

  /**
   * Data attributes
   */
  [key: `data-${string}`]: string | number | boolean | undefined;
}

/**
 * Props with children
 */
export interface WithChildren {
  /**
   * React children
   */
  children?: ReactNode;
}

/**
 * Props with required children
 */
export interface WithRequiredChildren {
  /**
   * React children (required)
   */
  children: ReactNode;
}

/**
 * Props with render function
 */
export interface WithRenderProp<T = unknown> {
  /**
   * Render prop function
   */
  render: (props: T) => ReactNode;
}

/**
 * Component with loading state
 */
export interface LoadingState {
  /**
   * Whether component is in loading state
   */
  loading?: boolean;

  /**
   * Loading indicator to display
   */
  loadingComponent?: ReactNode;
}

/**
 * Component with error state
 */
export interface ErrorState {
  /**
   * Error object if operation failed
   */
  error?: Error | null;

  /**
   * Error component to display
   */
  errorComponent?: ReactNode;

  /**
   * Error retry function
   */
  onRetry?: () => void;
}

/**
 * Component with disabled state
 */
export interface DisabledState {
  /**
   * Whether component is disabled
   */
  disabled?: boolean;

  /**
   * Disabled reason tooltip
   */
  disabledReason?: string;
}

/**
 * Component with testID for testing
 */
export interface WithTestId {
  /**
   * Test identifier for E2E testing
   */
  testId?: string;

  /**
   * Data-testid attribute (alias)
   */
  'data-testid'?: string;
}

/**
 * Size variant prop
 */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variant prop
 */
export type Color =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'default';

/**
 * Variant prop for styled components
 */
export type Variant = 'contained' | 'outlined' | 'text' | 'ghost';

/**
 * Alignment prop
 */
export type Alignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Position prop
 */
export type Position =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Component with size variant
 */
export interface WithSize {
  /**
   * Component size
   */
  size?: Size;
}

/**
 * Component with color variant
 */
export interface WithColor {
  /**
   * Component color
   */
  color?: Color;
}

/**
 * Component with variant
 */
export interface WithVariant {
  /**
   * Component variant
   */
  variant?: Variant;
}

/**
 * Component with icon
 */
export interface WithIcon {
  /**
   * Icon component or element
   */
  icon?: ReactNode;

  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
}

/**
 * Component with label
 */
export interface WithLabel {
  /**
   * Label text
   */
  label?: string;

  /**
   * Whether label is required
   */
  required?: boolean;

  /**
   * Label helper text
   */
  helperText?: string;
}

/**
 * Clickable component props
 */
export interface ClickableProps {
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent) => void;

  /**
   * Double click handler
   */
  onDoubleClick?: (event: React.MouseEvent) => void;

  /**
   * Whether component is clickable
   */
  clickable?: boolean;
}

/**
 * Focusable component props
 */
export interface FocusableProps {
  /**
   * Focus handler
   */
  onFocus?: (event: React.FocusEvent) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: React.FocusEvent) => void;

  /**
   * Auto focus on mount
   */
  autoFocus?: boolean;

  /**
   * Tab index
   */
  tabIndex?: number;
}

/**
 * Form field component props
 */
export interface FormFieldProps<T = any> extends WithLabel {
  /**
   * Field name
   */
  name: string;

  /**
   * Field value
   */
  value: T;

  /**
   * Change handler
   */
  onChange: (value: T) => void;

  /**
   * Error message
   */
  error?: string;

  /**
   * Whether field is required
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether field is disabled
   */
  disabled?: boolean;

  /**
   * Whether field is read-only
   */
  readOnly?: boolean;
}

/**
 * Modal component props
 */
export interface ModalProps extends WithChildren, WithTestId {
  /**
   * Whether modal is open
   */
  open: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal size
   */
  size?: Size;

  /**
   * Close on backdrop click
   */
  closeOnBackdropClick?: boolean;

  /**
   * Close on escape key
   */
  closeOnEscape?: boolean;

  /**
   * Show close button
   */
  showCloseButton?: boolean;
}

/**
 * Tooltip props
 */
export interface TooltipProps extends WithChildren {
  /**
   * Tooltip content
   */
  content: ReactNode;

  /**
   * Tooltip position
   */
  position?: Position;

  /**
   * Show delay in milliseconds
   */
  delay?: number;

  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean;
}

/**
 * Dropdown option
 */
export interface DropdownOption<T = any> {
  /**
   * Option label
   */
  label: string;

  /**
   * Option value
   */
  value: T;

  /**
   * Option icon
   */
  icon?: ReactNode;

  /**
   * Whether option is disabled
   */
  disabled?: boolean;

  /**
   * Option group
   */
  group?: string;
}

/**
 * Dropdown props
 */
export interface DropdownProps<T = any> extends WithLabel {
  /**
   * Available options
   */
  options: DropdownOption<T>[];

  /**
   * Selected value
   */
  value: T | null;

  /**
   * Change handler
   */
  onChange: (value: T) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Whether dropdown is disabled
   */
  disabled?: boolean;

  /**
   * Whether dropdown is searchable
   */
  searchable?: boolean;

  /**
   * Whether dropdown supports multiple selection
   */
  multiple?: boolean;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  /**
   * Column key
   */
  key: string;

  /**
   * Column header label
   */
  label: string;

  /**
   * Render cell content
   */
  render?: (row: T, index: number) => ReactNode;

  /**
   * Column width
   */
  width?: string | number;

  /**
   * Whether column is sortable
   */
  sortable?: boolean;

  /**
   * Sort key (if different from column key)
   */
  sortKey?: string;

  /**
   * Column alignment
   */
  align?: Alignment;
}

/**
 * Table props
 */
export interface TableProps<T = any> {
  /**
   * Table columns
   */
  columns: TableColumn<T>[];

  /**
   * Table data
   */
  data: T[];

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Empty state message
   */
  emptyMessage?: ReactNode;

  /**
   * Row key extractor
   */
  rowKey?: (row: T, index: number) => string | number;

  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;

  /**
   * Selectable rows
   */
  selectable?: boolean;

  /**
   * Selected rows
   */
  selectedRows?: T[];

  /**
   * Selection change handler
   */
  onSelectionChange?: (rows: T[]) => void;
}

/**
 * Higher-order component type
 */
export type HOC<P = {}, InjectedProps = {}> = <C extends ComponentType<any>>(
  Component: C,
) => ComponentType<Omit<React.ComponentProps<C>, keyof InjectedProps> & P>;

/**
 * Polymorphic component props
 */
export type PolymorphicProps<T extends React.ElementType> = {
  /**
   * Element type to render as
   */
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

/**
 * Forwarded ref component type
 */
export type ForwardedRefComponent<T, P = {}> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<P> & React.RefAttributes<T>
>;
