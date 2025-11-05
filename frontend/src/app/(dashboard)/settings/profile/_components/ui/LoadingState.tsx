/**
 * @fileoverview Loading state component for profile data
 * @module app/(dashboard)/profile/_components/ui/LoadingState
 * @category Profile - UI Components
 */

'use client';

interface LoadingStateProps {
  message?: string;
}

/**
 * Loading state component with spinner
 * Used while fetching profile data
 */
export function LoadingState({ message = 'Loading profile...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
}
