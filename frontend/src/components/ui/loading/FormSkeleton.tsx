'use client';

/**
 * FormSkeleton - Loading skeleton for form components
 *
 * Provides a placeholder UI while lazy-loaded forms are being fetched.
 * Matches the visual structure of typical form layouts in the application.
 *
 * @module components/ui/loading/FormSkeleton
 */

import React from 'react';

export interface FormSkeletonProps {
  /** Number of form fields to display */
  fields?: number;
  /** Show submit button */
  showSubmit?: boolean;
  /** Show cancel button */
  showCancel?: boolean;
  /** Form title skeleton */
  showTitle?: boolean;
  /** Layout orientation */
  layout?: 'vertical' | 'horizontal';
}

/**
 * Form loading skeleton component
 *
 * @example
 * ```tsx
 * <Suspense fallback={<FormSkeleton fields={6} showTitle />}>
 *   <StudentForm />
 * </Suspense>
 * ```
 */
export function FormSkeleton({
  fields = 5,
  showSubmit = true,
  showCancel = true,
  showTitle = false,
  layout = 'vertical',
}: FormSkeletonProps) {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Title */}
      {showTitle && (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      )}

      {/* Form Fields */}
      <div className={`space-y-${layout === 'vertical' ? '4' : '6'}`}>
        {Array.from({ length: fields }).map((_, i) => (
          <div
            key={`skeleton-field-${i}`}
            className={layout === 'horizontal' ? 'grid grid-cols-3 gap-4 items-center' : 'space-y-2'}
          >
            {/* Label */}
            <div
              className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
                layout === 'horizontal' ? 'col-span-1' : 'w-1/4'
              }`}
            />

            {/* Input */}
            <div
              className={`h-10 bg-gray-200 dark:bg-gray-700 rounded ${
                layout === 'horizontal' ? 'col-span-2' : 'w-full'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {(showSubmit || showCancel) && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {showCancel && (
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          )}
          {showSubmit && (
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32" />
          )}
        </div>
      )}
    </div>
  );
}

FormSkeleton.displayName = 'FormSkeleton';

export default FormSkeleton;
