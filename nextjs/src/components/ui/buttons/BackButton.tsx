'use client';

/**
 * WF-COMP-006 | BackButton.tsx - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../hooks/useRouteState | Dependencies: react, lucide-react, ../hooks/useRouteState
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, functions, types | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .tsx
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * BackButton Component
 *
 * Enterprise navigation component with state restoration,
 * scroll position recovery, and accessibility features.
 *
 * @module components/BackButton
 */

import React, { useCallback, useMemo } from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useNavigationState } from '../../../hooks/utilities/useRouteState';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for the BackButton component.
 *
 * @interface BackButtonProps
 *
 * @property {string} [fallbackPath='/'] - Path to navigate to if browser history is unavailable
 * @property {string} [label='Back'] - Text displayed next to the icon
 * @property {('default' | 'ghost' | 'link')} [variant='default'] - Visual style variant
 *   - default: Bordered button with background
 *   - ghost: Transparent with hover background
 *   - link: Text-only link appearance
 * @property {('arrow' | 'chevron')} [iconVariant='arrow'] - Icon type to display
 *   - arrow: Left arrow icon (ArrowLeft from lucide-react)
 *   - chevron: Left chevron icon (ChevronLeft from lucide-react)
 * @property {string} [className=''] - Additional CSS classes to apply
 * @property {boolean} [showLabelOnMobile=false] - Whether to show label text on mobile screens
 * @property {() => void} [onClick] - Custom click handler that overrides default navigation behavior
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {string} [dataTestId='back-button'] - Test identifier for automated testing
 */
interface BackButtonProps {
  /** Fallback path if no history available */
  fallbackPath?: string;
  /** Button label */
  label?: string;
  /** Button variant */
  variant?: 'default' | 'ghost' | 'link';
  /** Icon variant */
  iconVariant?: 'arrow' | 'chevron';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show label on mobile */
  showLabelOnMobile?: boolean;
  /** Custom onClick handler (overrides default back behavior) */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Data test ID */
  dataTestId?: string;
}

// ============================================================================
// BACKBUTTON COMPONENT
// ============================================================================

/**
 * BackButton component with intelligent navigation and state restoration.
 *
 * Features:
 * - Restores previous route with state
 * - Recovers scroll position
 * - Fallback to specified path if no history
 * - Keyboard accessible
 * - Multiple visual variants
 * - Mobile-responsive
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BackButton />
 *
 * // With custom fallback
 * <BackButton fallbackPath="/students" label="Back to Students" />
 *
 * // Ghost variant
 * <BackButton variant="ghost" iconVariant="chevron" />
 *
 * // With custom click handler
 * <BackButton onClick={() => handleCustomBack()} />
 * ```
 */
// Memoized BackButton component for optimized rendering
const BackButton = React.memo<BackButtonProps>(({
  fallbackPath = '/',
  label = 'Back',
  variant = 'default',
  iconVariant = 'arrow',
  className = '',
  showLabelOnMobile = false,
  onClick,
  disabled = false,
  dataTestId = 'back-button',
}) => {
  const { navigateBack, previousPath, canGoBack } = useNavigationState();

  // Memoize back navigation handler to prevent recreation on every render
  const handleBack = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (canGoBack) {
      navigateBack(fallbackPath);
    } else {
      navigateBack(fallbackPath);
    }
  }, [onClick, canGoBack, navigateBack, fallbackPath]);

  // Memoize icon component selection
  const IconComponent = useMemo(() =>
    iconVariant === 'chevron' ? ChevronLeft : ArrowLeft,
    [iconVariant]
  );

  // Memoize button classes based on variant
  const variantClasses = useMemo(() => {
    const baseClasses = `
      inline-flex items-center gap-2
      transition-all duration-200 ease-in-out
      transform active:scale-[0.98]
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
      disabled:opacity-50 disabled:cursor-not-allowed
      motion-reduce:transition-none motion-reduce:transform-none
      rounded-md
    `;

    switch (variant) {
      case 'ghost':
        return `${baseClasses}
          text-gray-700 hover:text-gray-900 active:text-gray-950
          hover:bg-gray-100 active:bg-gray-200
          dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700
          px-2 py-1.5
        `;
      case 'link':
        return `${baseClasses}
          text-primary-600 hover:text-primary-700 active:text-primary-800
          hover:underline
          dark:text-primary-400 dark:hover:text-primary-300
          px-0 py-0
        `;
      case 'default':
      default:
        return `${baseClasses}
          bg-white text-gray-700
          border border-gray-300
          hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100
          dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:active:bg-gray-600
          px-3 py-2
          shadow-sm hover:shadow-md
        `;
    }
  }, [variant]);

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={disabled}
      className={`
        ${variantClasses}
        ${className}
      `}
      aria-label={previousPath ? `Navigate back to ${previousPath}` : 'Navigate to previous page'}
      aria-disabled={disabled}
      data-testid={dataTestId}
    >
      <IconComponent
        className="h-4 w-4 flex-shrink-0"
        aria-hidden="true"
      />
      <span
        className={`
          font-medium text-sm
          ${showLabelOnMobile ? '' : 'hidden sm:inline'}
        `}
      >
        {label}
      </span>
    </button>
  );
});

BackButton.displayName = 'BackButton';

export default BackButton;

// ============================================================================
// ICON-ONLY BACK BUTTON COMPONENT
// ============================================================================

/**
 * Props for the IconBackButton component.
 *
 * @interface IconBackButtonProps
 *
 * @property {string} [fallbackPath='/'] - Path to navigate to if browser history is unavailable
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Button and icon size
 *   - sm: 32px button, 16px icon
 *   - md: 40px button, 20px icon
 *   - lg: 48px button, 24px icon
 * @property {() => void} [onClick] - Custom click handler that overrides default navigation behavior
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {string} [className=''] - Additional CSS classes to apply
 * @property {string} [title='Go back'] - Tooltip text and aria-label for accessibility
 * @property {string} [dataTestId='icon-back-button'] - Test identifier for automated testing
 */
interface IconBackButtonProps {
  /** Fallback path if no history available */
  fallbackPath?: string;
  /** Icon size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom onClick handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Tooltip text */
  title?: string;
  /** Data test ID */
  dataTestId?: string;
}

/**
 * Icon-only back button for compact spaces and toolbar usage.
 *
 * A circular button with just an arrow icon, ideal for headers, toolbars,
 * and space-constrained layouts. Provides the same navigation functionality
 * as BackButton but in a more compact form factor.
 *
 * **Features:**
 * - Circular design with arrow icon
 * - Three size options (sm, md, lg)
 * - State restoration on navigation
 * - Accessible with title/aria-label
 * - Focus ring for keyboard navigation
 * - Hover state with background
 *
 * **Accessibility:**
 * - title attribute for tooltip
 * - aria-label for screen readers
 * - Visible focus ring
 * - Disabled state support
 *
 * @component
 * @param {IconBackButtonProps} props - Icon back button props
 * @returns {JSX.Element} Rendered circular back button
 *
 * @example
 * ```tsx
 * // Default medium size
 * <IconBackButton title="Go back" />
 *
 * // Small size for compact header
 * <IconBackButton size="sm" fallbackPath="/dashboard" />
 *
 * // Large size with custom handler
 * <IconBackButton
 *   size="lg"
 *   onClick={handleCustomBack}
 *   title="Return to previous page"
 * />
 * ```
 *
 * @see {@link BackButton} for full-featured back button with label
 */
// Memoized IconBackButton component
export const IconBackButton = React.memo<IconBackButtonProps>(({
  fallbackPath = '/',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  title = 'Go back',
  dataTestId = 'icon-back-button',
}) => {
  const { navigateBack } = useNavigationState();

  // Memoize back handler
  const handleBack = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      navigateBack(fallbackPath);
    }
  }, [onClick, navigateBack, fallbackPath]);

  // Memoize size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 p-1.5';
      case 'lg':
        return 'h-12 w-12 p-3';
      case 'md':
      default:
        return 'h-10 w-10 p-2';
    }
  }, [size]);

  // Memoize icon size
  const iconSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      case 'md':
      default:
        return 'h-5 w-5';
    }
  }, [size]);

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={disabled}
      className={`
        ${sizeClasses}
        inline-flex items-center justify-center
        text-gray-700 hover:text-gray-900
        hover:bg-gray-100
        rounded-full
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={title}
      title={title}
      data-testid={dataTestId}
    >
      <ArrowLeft
        className={`${iconSize} flex-shrink-0`}
        aria-hidden="true"
      />
    </button>
  );
});

IconBackButton.displayName = 'IconBackButton';

// ============================================================================
// BACK BUTTON WITH CONFIRMATION
// ============================================================================

/**
 * Props for the BackButtonWithConfirmation component.
 *
 * @interface BackButtonWithConfirmationProps
 * @extends {BackButtonProps}
 *
 * @property {string} [confirmMessage='Are you sure you want to go back? Any unsaved changes will be lost.'] - Message displayed in confirmation dialog
 * @property {boolean} [requireConfirmation=false] - Whether to show confirmation dialog before navigating
 */
interface BackButtonWithConfirmationProps extends BackButtonProps {
  /** Confirmation message */
  confirmMessage?: string;
  /** Whether to show confirmation */
  requireConfirmation?: boolean;
}

/**
 * BackButton with optional confirmation dialog for unsaved changes.
 *
 * Extends BackButton with conditional confirmation prompt to prevent
 * accidental navigation away from forms or pages with unsaved data.
 * Uses native browser confirm() dialog for immediate user feedback.
 *
 * **Features:**
 * - Conditional confirmation based on requireConfirmation prop
 * - Customizable confirmation message
 * - All standard BackButton features
 * - Native browser dialog (no additional components needed)
 *
 * **Use Cases:**
 * - Forms with unsaved changes
 * - Multi-step processes
 * - Data entry workflows
 * - Draft content editing
 *
 * @component
 * @param {BackButtonWithConfirmationProps} props - Back button with confirmation props
 * @returns {JSX.Element} Rendered back button with confirmation capability
 *
 * @example
 * ```tsx
 * // Conditional confirmation based on form state
 * const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
 *
 * <BackButtonWithConfirmation
 *   requireConfirmation={hasUnsavedChanges}
 *   confirmMessage="You have unsaved changes. Are you sure you want to go back?"
 *   fallbackPath="/students"
 * />
 *
 * // Always require confirmation
 * <BackButtonWithConfirmation
 *   requireConfirmation={true}
 *   confirmMessage="Exit without saving?"
 *   variant="ghost"
 * />
 *
 * // Custom handler after confirmation
 * <BackButtonWithConfirmation
 *   requireConfirmation={isDirty}
 *   onClick={() => {
 *     // Custom cleanup before navigation
 *     clearForm();
 *   }}
 * />
 * ```
 *
 * @see {@link BackButton} for base back button component
 */
// Memoized BackButtonWithConfirmation component
export const BackButtonWithConfirmation = React.memo<BackButtonWithConfirmationProps>(({
  requireConfirmation = false,
  confirmMessage = 'Are you sure you want to go back? Any unsaved changes will be lost.',
  onClick,
  ...props
}) => {
  // Memoize click handler
  const handleClick = useCallback(() => {
    if (requireConfirmation) {
      const confirmed = window.confirm(confirmMessage);
      if (confirmed && onClick) {
        onClick();
      } else if (confirmed) {
        // Default back behavior will be handled by parent BackButton
      }
    } else if (onClick) {
      onClick();
    }
  }, [requireConfirmation, confirmMessage, onClick]);

  return (
    <BackButton
      {...props}
      onClick={handleClick}
    />
  );
});

BackButtonWithConfirmation.displayName = 'BackButtonWithConfirmation';

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  BackButtonProps,
  IconBackButtonProps,
  BackButtonWithConfirmationProps,
};

