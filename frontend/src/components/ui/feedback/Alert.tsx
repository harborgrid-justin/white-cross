/**
 * WF-ALERT-001 | Alert.tsx - Alert Component
 * Purpose: Alert notification component with multiple variants and dismissible functionality
 * Upstream: Design system | Dependencies: React, Tailwind CSS, cn utility
 * Downstream: Pages, forms, notifications | Called by: Application components
 * Related: AlertBanner, Toast components
 * Exports: Alert, AlertTitle, AlertDescription components | Key Features: Variants, sizes, dismissible, icons
 * Last Updated: 2025-10-26 | File Type: .tsx
 * Critical Path: Render alert → User reads message → Optional dismiss action
 * LLM Context: Alert component for White Cross healthcare platform
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Alert component.
 *
 * @interface AlertProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {('default' | 'primary' | 'success' | 'warning' | 'error' | 'danger' | 'info')} [variant='default'] - Visual style variant indicating alert severity/type
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Alert size affecting padding and text size
 * @property {boolean} [dismissible=false] - Whether alert can be dismissed by user
 * @property {() => void} [onDismiss] - Callback function executed when alert is dismissed
 * @property {React.ReactNode} [icon] - Custom icon to display (overrides default variant icon)
 * @property {boolean} [showIcon=true] - Whether to display icon in alert
 */
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

/**
 * Props for the AlertTitle component.
 *
 * @interface AlertTitleProps
 * @extends {React.HTMLAttributes<HTMLHeadingElement>}
 */
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Props for the AlertDescription component.
 *
 * @interface AlertDescriptionProps
 * @extends {React.HTMLAttributes<HTMLParagraphElement>}
 */
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Alert component for displaying important messages to users.
 *
 * A flexible alert component with multiple severity levels, customizable icons,
 * and optional dismiss functionality. Includes proper ARIA attributes for
 * accessibility based on alert severity.
 *
 * **Features:**
 * - 7 visual variants (default, primary, success, warning, error, danger, info)
 * - 3 size options (sm, md, lg)
 * - Dismissible with custom callback
 * - Default icons per variant or custom icons
 * - Dark mode support
 * - Accessible with appropriate aria-live regions
 *
 * **Accessibility:**
 * - role="alert" for screen readers
 * - aria-live="assertive" for critical alerts (error, danger, warning)
 * - aria-live="polite" for informational alerts
 * - aria-atomic="true" for complete message reading
 * - Screen reader text for dismiss button
 *
 * @component
 * @param {AlertProps} props - Alert component props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to alert element
 * @returns {JSX.Element} Rendered alert element
 *
 * @example
 * ```tsx
 * // Success alert
 * <Alert variant="success">
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 *
 * // Error alert with dismiss
 * <Alert variant="error" dismissible onDismiss={() => console.log('Dismissed')}>
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Please correct the errors below.</AlertDescription>
 * </Alert>
 *
 * // Warning with custom icon
 * <Alert variant="warning" icon={<CustomIcon />}>
 *   Important notice here
 * </Alert>
 *
 * // Large primary alert
 * <Alert variant="primary" size="lg">
 *   <AlertDescription>New feature available!</AlertDescription>
 * </Alert>
 * ```
 *
 * @remarks
 * **Healthcare Context**: Use appropriate variants for medical notifications:
 * - error/danger: Critical health alerts, medication errors
 * - warning: Important reminders, missing information
 * - success: Successful health record updates
 * - info: General health information, appointment reminders
 *
 * @see {@link AlertTitle} for alert title component
 * @see {@link AlertDescription} for alert description component
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    dismissible = false,
    onDismiss,
    icon,
    showIcon = true,
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      default: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200',
      primary: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-200',
      success: 'bg-success-50 border-success-200 text-success-800 dark:bg-success-950 dark:border-success-800 dark:text-success-200',
      warning: 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-200',
      error: 'bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-200',
      danger: 'bg-danger-50 border-danger-200 text-danger-800 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-200',
      info: 'bg-info-50 border-info-200 text-info-800 dark:bg-info-950 dark:border-info-800 dark:text-info-200'
    };

    const sizeClasses = {
      sm: 'p-3 text-sm',
      md: 'p-4 text-base',
      lg: 'p-6 text-lg'
    };

    const iconClasses = {
      default: 'text-gray-400 dark:text-gray-500',
      primary: 'text-primary-400 dark:text-primary-500',
      success: 'text-success-400 dark:text-success-500',
      warning: 'text-warning-400 dark:text-warning-500',
      error: 'text-danger-400 dark:text-danger-500',
      danger: 'text-danger-400 dark:text-danger-500',
      info: 'text-info-400 dark:text-info-500'
    };

    const defaultIcons = {
      default: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      primary: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      danger: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    };

    // Determine aria-live based on variant severity
    const ariaLive = variant === 'error' || variant === 'danger' || variant === 'warning'
      ? 'assertive'
      : 'polite';

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={ariaLive}
        aria-atomic="true"
        className={cn(
          'relative rounded-lg border transition-all duration-200',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className="flex">
          {showIcon && (
            <div className="flex-shrink-0">
              <div className={cn('mt-0.5', iconClasses[variant])}>
                {icon || defaultIcons[variant]}
              </div>
            </div>
          )}
          <div className={cn('flex-1', showIcon && 'ml-3')}>
            {children}
          </div>
          {dismissible && (
            <div className="flex-shrink-0 ml-3">
              <button
                type="button"
                onClick={onDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  iconClasses[variant],
                  'hover:bg-black/5 focus:ring-current'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

/**
 * Alert title heading component.
 *
 * Renders a semantic heading (h3) for the alert title with consistent styling.
 * Should be used as the first child within an Alert component for proper hierarchy.
 *
 * **Features:**
 * - Semantic h3 heading for accessibility
 * - Consistent typography (font-medium, text-sm)
 * - Bottom margin for spacing
 * - Inherits text color from parent Alert
 *
 * @component
 * @param {AlertTitleProps} props - Alert title props
 * @param {React.Ref<HTMLHeadingElement>} ref - Forwarded ref to heading element
 * @returns {JSX.Element} Rendered alert title heading
 *
 * @example
 * ```tsx
 * <Alert variant="warning">
 *   <AlertTitle>Attention Required</AlertTitle>
 *   <AlertDescription>Please review your information.</AlertDescription>
 * </Alert>
 * ```
 *
 * @see {@link Alert} for parent alert component
 */
const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-sm font-medium mb-1', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

/**
 * Alert description component.
 *
 * Renders the main content/description text within an alert. Automatically
 * styled with appropriate opacity for visual hierarchy.
 *
 * **Features:**
 * - Consistent text size (text-sm)
 * - Reduced opacity (90%) for hierarchy
 * - Inherits text color from parent Alert
 * - Supports rich content (not just text)
 *
 * @component
 * @param {AlertDescriptionProps} props - Alert description props
 * @param {React.Ref<HTMLParagraphElement>} ref - Forwarded ref to description element
 * @returns {JSX.Element} Rendered alert description
 *
 * @example
 * ```tsx
 * <Alert variant="info">
 *   <AlertTitle>New Information</AlertTitle>
 *   <AlertDescription>
 *     Your account has been updated with the latest security features.
 *     <a href="/security">Learn more</a>
 *   </AlertDescription>
 * </Alert>
 * ```
 *
 * @see {@link Alert} for parent alert component
 */
const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm opacity-90', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
AlertTitle.displayName = 'AlertTitle';
AlertDescription.displayName = 'AlertDescription';

export { 
  Alert, 
  AlertTitle, 
  AlertDescription,
  type AlertProps,
  type AlertTitleProps,
  type AlertDescriptionProps
};
