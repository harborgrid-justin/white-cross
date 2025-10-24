/**
 * Card Layout Component Module
 *
 * Flexible container component system for organizing content into structured sections.
 * Provides a composable card pattern with header, content, footer, and title components.
 *
 * @module components/ui/layout/Card
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the Card component.
 *
 * @interface CardProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {('default' | 'outlined' | 'elevated' | 'flat')} [variant='default'] - Visual style variant
 *   - default: Standard white card with soft shadow and border
 *   - outlined: Prominent 2px border without elevation
 *   - elevated: Enhanced shadow for prominent emphasis
 *   - flat: Subtle gray background with minimal border
 * @property {('none' | 'sm' | 'md' | 'lg' | 'xl')} [padding='md'] - Internal padding size
 *   - none: No padding (0px)
 *   - sm: Small padding (12px)
 *   - md: Medium padding (16px) - default
 *   - lg: Large padding (24px)
 *   - xl: Extra large padding (32px)
 * @property {('none' | 'sm' | 'md' | 'lg' | 'xl' | 'full')} [rounded='md'] - Border radius size
 *   - none: Square corners
 *   - sm/md/lg/xl: Increasing border radius
 *   - full: Fully rounded (pill shape)
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Props for the CardHeader component.
 *
 * @interface CardHeaderProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {boolean} [divider=false] - Whether to show bottom border divider
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

/**
 * Props for the CardContent component.
 *
 * @interface CardContentProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Props for the CardFooter component.
 *
 * @interface CardFooterProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {boolean} [divider=false] - Whether to show top border divider
 */
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

/**
 * Card container component for organizing content into structured sections.
 *
 * A flexible, themeable container that supports multiple visual variants,
 * customizable padding, and border radius. Designed to work with CardHeader,
 * CardContent, and CardFooter subcomponents for structured layouts.
 *
 * **Features:**
 * - 4 visual variants (default, outlined, elevated, flat)
 * - Customizable padding (none to xl)
 * - Adjustable border radius
 * - Dark mode support
 * - Smooth transitions
 * - Overflow handling
 * - Forward ref support
 *
 * **Composition Pattern:**
 * Use with CardHeader, CardContent, CardFooter, CardTitle, and CardDescription
 * for structured, semantic card layouts.
 *
 * @component
 * @param {CardProps} props - Card component props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to div element
 * @returns {JSX.Element} Rendered card container
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <p>Simple card content</p>
 * </Card>
 *
 * // Structured card with all sections
 * <Card variant="elevated" padding="lg">
 *   <CardHeader divider>
 *     <CardTitle>Patient Information</CardTitle>
 *     <CardDescription>View and edit patient details</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <PatientForm />
 *   </CardContent>
 *   <CardFooter divider>
 *     <Button>Save Changes</Button>
 *   </CardFooter>
 * </Card>
 *
 * // Outlined variant with custom styling
 * <Card variant="outlined" rounded="lg" className="hover:shadow-lg">
 *   <CardContent>
 *     <StatsDisplay />
 *   </CardContent>
 * </Card>
 * ```
 *
 * @see {@link CardHeader} for card header section
 * @see {@link CardContent} for main content section
 * @see {@link CardFooter} for footer section
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', rounded = 'md', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border border-gray-200 shadow-soft dark:bg-gray-800 dark:border-gray-700',
      outlined: 'bg-white border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
      elevated: 'bg-white shadow-smooth border border-gray-100 dark:bg-gray-800 dark:border-gray-700',
      flat: 'bg-gray-50 border border-gray-200 dark:bg-gray-900 dark:border-gray-800'
    };

    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };

    const roundedClasses = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden transition-all duration-200',
          variantClasses[variant],
          paddingClasses[padding],
          roundedClasses[rounded],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * CardHeader component for card title and description section.
 *
 * Provides a consistently styled header section with optional bottom divider.
 * Typically contains CardTitle and CardDescription components.
 *
 * @component
 * @param {CardHeaderProps} props - Card header props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered card header
 *
 * @example
 * ```tsx
 * <CardHeader divider>
 *   <CardTitle>Section Title</CardTitle>
 *   <CardDescription>Optional description</CardDescription>
 * </CardHeader>
 * ```
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4',
          divider && 'border-b border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * CardContent component for main card body content.
 *
 * Standard content section with consistent padding. Contains the primary
 * card information or interactive elements.
 *
 * @component
 * @param {CardContentProps} props - Card content props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered card content
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <Form />
 * </CardContent>
 * ```
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * CardFooter component for card actions and supplementary content.
 *
 * Footer section with subtle background and optional top divider.
 * Typically contains action buttons or additional information.
 *
 * @component
 * @param {CardFooterProps} props - Card footer props
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered card footer
 *
 * @example
 * ```tsx
 * <CardFooter divider>
 *   <Button variant="primary">Save</Button>
 *   <Button variant="ghost">Cancel</Button>
 * </CardFooter>
 * ```
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, divider = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4 bg-gray-50 rounded-b-lg dark:bg-gray-900',
          divider && 'border-t border-gray-200 dark:border-gray-700',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * CardTitle component for card heading.
 *
 * Semantic h3 heading with consistent typography for card titles.
 * Use within CardHeader for proper semantic structure.
 *
 * @component
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props - Heading props
 * @param {React.Ref<HTMLHeadingElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered card title heading
 *
 * @example
 * ```tsx
 * <CardTitle>Patient Dashboard</CardTitle>
 * ```
 */
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-6 text-gray-900 dark:text-white', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

/**
 * CardDescription component for card subtitle or description.
 *
 * Provides secondary text below the card title with muted styling.
 * Use within CardHeader below CardTitle.
 *
 * @component
 * @param {React.HTMLAttributes<HTMLParagraphElement>} props - Paragraph props
 * @param {React.Ref<HTMLParagraphElement>} ref - Forwarded ref
 * @returns {JSX.Element} Rendered card description
 *
 * @example
 * ```tsx
 * <CardDescription>
 *   View and manage patient information
 * </CardDescription>
 * ```
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps
};
