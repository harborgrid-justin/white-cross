import React from 'react';
import { cn } from '../../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divider?: boolean;
}

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
