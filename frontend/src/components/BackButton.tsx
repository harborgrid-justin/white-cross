/**
 * BackButton Component
 *
 * Enterprise navigation component with state restoration,
 * scroll position recovery, and accessibility features.
 *
 * @module components/BackButton
 */

import React from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useNavigationState } from '../hooks/useRouteState';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

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
export default function BackButton({
  fallbackPath = '/',
  label = 'Back',
  variant = 'default',
  iconVariant = 'arrow',
  className = '',
  showLabelOnMobile = false,
  onClick,
  disabled = false,
  dataTestId = 'back-button',
}: BackButtonProps) {
  const { navigateBack, previousPath, canGoBack } = useNavigationState();

  // Handle back navigation
  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (canGoBack) {
      navigateBack(fallbackPath);
    } else {
      navigateBack(fallbackPath);
    }
  };

  // Select icon based on variant
  const IconComponent = iconVariant === 'chevron' ? ChevronLeft : ArrowLeft;

  // Get button classes based on variant
  const getVariantClasses = () => {
    const baseClasses = `
      inline-flex items-center gap-2
      transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      rounded-md
    `;

    switch (variant) {
      case 'ghost':
        return `${baseClasses}
          text-gray-700 hover:text-gray-900
          hover:bg-gray-100
          px-2 py-1.5
        `;
      case 'link':
        return `${baseClasses}
          text-primary-600 hover:text-primary-700
          hover:underline
          px-0 py-0
        `;
      case 'default':
      default:
        return `${baseClasses}
          bg-white text-gray-700
          border border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          px-3 py-2
          shadow-sm
        `;
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={disabled}
      className={`
        ${getVariantClasses()}
        ${className}
      `}
      aria-label={`Navigate back to ${previousPath || 'previous page'}`}
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
}

// ============================================================================
// ICON-ONLY BACK BUTTON COMPONENT
// ============================================================================

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
 * Icon-only back button for compact spaces.
 *
 * @example
 * ```tsx
 * <IconBackButton title="Go back" />
 * ```
 */
export function IconBackButton({
  fallbackPath = '/',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  title = 'Go back',
  dataTestId = 'icon-back-button',
}: IconBackButtonProps) {
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigateBack(fallbackPath);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-8 p-1.5';
      case 'lg':
        return 'h-12 w-12 p-3';
      case 'md':
      default:
        return 'h-10 w-10 p-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      case 'md':
      default:
        return 'h-5 w-5';
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      disabled={disabled}
      className={`
        ${getSizeClasses()}
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
        className={`${getIconSize()} flex-shrink-0`}
        aria-hidden="true"
      />
    </button>
  );
}

// ============================================================================
// BACK BUTTON WITH CONFIRMATION
// ============================================================================

interface BackButtonWithConfirmationProps extends BackButtonProps {
  /** Confirmation message */
  confirmMessage?: string;
  /** Whether to show confirmation */
  requireConfirmation?: boolean;
}

/**
 * BackButton with optional confirmation for unsaved changes.
 *
 * @example
 * ```tsx
 * <BackButtonWithConfirmation
 *   requireConfirmation={hasUnsavedChanges}
 *   confirmMessage="You have unsaved changes. Are you sure you want to go back?"
 * />
 * ```
 */
export function BackButtonWithConfirmation({
  requireConfirmation = false,
  confirmMessage = 'Are you sure you want to go back? Any unsaved changes will be lost.',
  onClick,
  ...props
}: BackButtonWithConfirmationProps) {
  const handleClick = () => {
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
  };

  return (
    <BackButton
      {...props}
      onClick={handleClick}
    />
  );
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  BackButtonProps,
  IconBackButtonProps,
  BackButtonWithConfirmationProps,
};
