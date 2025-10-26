'use client';

/**
 * @fileoverview Progress indicator components for visualizing task completion and loading states.
 *
 * This module provides three distinct progress indicator components designed for healthcare
 * applications. Each component offers visual feedback for ongoing processes, data loading,
 * and task completion in school nurse workflows.
 *
 * **Components:**
 * - `Progress` - Linear progress bar with percentage tracking and visual variants
 * - `CircularProgress` - Circular/radial progress indicator for compact spaces
 * - `Skeleton` - Loading placeholder for content that's being fetched
 *
 * **Key Features:**
 * - Multiple visual variants (default, success, warning, error)
 * - Configurable sizes and animations
 * - Optional label display with customization
 * - Full ARIA progressbar support
 * - Percentage calculation with bounds checking
 * - Dark mode compatible via Tailwind utilities
 *
 * **Use Cases:**
 * - Form completion tracking (immunization records, health assessments)
 * - File upload progress (student documents, medical records)
 * - Multi-step workflow progress (enrollment, screening processes)
 * - Data loading states (student lists, health metrics)
 * - Health goal tracking (medication adherence, wellness programs)
 *
 * @module components/ui/feedback/Progress
 * @since 1.0.0
 *
 * @example Linear Progress for Form Completion
 * ```tsx
 * import { Progress } from '@/components/ui/feedback/Progress';
 *
 * function ImmunizationForm({ completedFields, totalFields }) {
 *   const progress = (completedFields / totalFields) * 100;
 *
 *   return (
 *     <div>
 *       <Progress
 *         value={completedFields}
 *         max={totalFields}
 *         variant="default"
 *         showLabel
 *         label={`${completedFields} of ${totalFields} fields completed`}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Circular Progress for Data Loading
 * ```tsx
 * import { CircularProgress } from '@/components/ui/feedback/Progress';
 *
 * function HealthRecordsLoader({ isLoading, progress }) {
 *   if (!isLoading) return <StudentHealthRecords />;
 *
 *   return (
 *     <div className="flex flex-col items-center justify-center py-12">
 *       <CircularProgress
 *         value={progress}
 *         size={64}
 *         variant="default"
 *         showLabel
 *       />
 *       <p className="mt-4 text-gray-600">Loading health records...</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Progress Variants for Health Status
 * ```tsx
 * function HealthMetricProgress({ metric }) {
 *   const getVariant = (percentage) => {
 *     if (percentage >= 90) return 'success';
 *     if (percentage >= 70) return 'default';
 *     if (percentage >= 50) return 'warning';
 *     return 'error';
 *   };
 *
 *   return (
 *     <div className="space-y-4">
 *       <div>
 *         <h3>Immunization Compliance</h3>
 *         <Progress
 *           value={metric.immunizationRate}
 *           variant={getVariant(metric.immunizationRate)}
 *           showLabel
 *           size="md"
 *         />
 *       </div>
 *       <div>
 *         <h3>Health Screening Completion</h3>
 *         <Progress
 *           value={metric.screeningRate}
 *           variant={getVariant(metric.screeningRate)}
 *           showLabel
 *           size="md"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Document Upload Progress
 * ```tsx
 * function DocumentUploader() {
 *   const [uploadProgress, setUploadProgress] = useState(0);
 *   const [isUploading, setIsUploading] = useState(false);
 *
 *   const handleUpload = async (file: File) => {
 *     setIsUploading(true);
 *     setUploadProgress(0);
 *
 *     // Simulate upload with progress
 *     const interval = setInterval(() => {
 *       setUploadProgress(prev => {
 *         if (prev >= 100) {
 *           clearInterval(interval);
 *           setIsUploading(false);
 *           return 100;
 *         }
 *         return prev + 10;
 *       });
 *     }, 200);
 *   };
 *
 *   return (
 *     <div>
 *       <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
 *       {isUploading && (
 *         <Progress
 *           value={uploadProgress}
 *           variant={uploadProgress === 100 ? 'success' : 'default'}
 *           showLabel
 *           animate={uploadProgress < 100}
 *           label={`Uploading... ${uploadProgress}%`}
 *           size="lg"
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Skeleton Loading for Student List
 * ```tsx
 * import { Skeleton } from '@/components/ui/feedback/Progress';
 *
 * function StudentListLoader({ isLoading, students }) {
 *   if (isLoading) {
 *     return (
 *       <div className="space-y-4">
 *         {[...Array(5)].map((_, i) => (
 *           <div key={i} className="flex items-center space-x-4">
 *             <Skeleton variant="circular" width={48} height={48} />
 *             <div className="flex-1 space-y-2">
 *               <Skeleton variant="text" width="60%" />
 *               <Skeleton variant="text" width="40%" />
 *             </div>
 *           </div>
 *         ))}
 *       </div>
 *     );
 *   }
 *
 *   return <StudentList students={students} />;
 * }
 * ```
 *
 * @example Multi-Step Enrollment Progress
 * ```tsx
 * function EnrollmentWizard() {
 *   const [currentStep, setCurrentStep] = useState(1);
 *   const totalSteps = 5;
 *   const steps = ['Personal Info', 'Emergency Contacts', 'Medical History', 'Immunizations', 'Review'];
 *
 *   return (
 *     <div>
 *       <div className="mb-8">
 *         <div className="flex justify-between mb-2">
 *           <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
 *           <span className="text-sm text-gray-600">{steps[currentStep - 1]}</span>
 *         </div>
 *         <Progress
 *           value={currentStep}
 *           max={totalSteps}
 *           variant="default"
 *           size="lg"
 *         />
 *       </div>
 *       <div className="space-y-4">
 *         Step content goes here
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Medication Adherence Tracking
 * ```tsx
 * function MedicationAdherence({ adherenceRate }) {
 *   const variant = adherenceRate >= 95 ? 'success' :
 *                   adherenceRate >= 85 ? 'default' :
 *                   adherenceRate >= 75 ? 'warning' : 'error';
 *
 *   return (
 *     <div className="p-6 bg-white rounded-lg shadow">
 *       <div className="flex items-center justify-between mb-4">
 *         <h3 className="text-lg font-medium">Medication Adherence</h3>
 *         <CircularProgress
 *           value={adherenceRate}
 *           size={80}
 *           strokeWidth={6}
 *           variant={variant}
 *           showLabel
 *         />
 *       </div>
 *       <Progress
 *         value={adherenceRate}
 *         variant={variant}
 *         showLabel={false}
 *         size="sm"
 *       />
 *       <p className="mt-2 text-sm text-gray-600">
 *         {adherenceRate >= 95 ? 'Excellent adherence!' :
 *          adherenceRate >= 85 ? 'Good adherence' :
 *          adherenceRate >= 75 ? 'Needs improvement' :
 *          'Critical - Follow up required'}
 *       </p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Uses ARIA progressbar role with valuenow, valuemin, valuemax attributes
 * - Provides aria-label for screen reader context
 * - Progress changes are announced by assistive technologies
 * - Visual and text indicators for color-blind users
 * - Sufficient color contrast for all variants
 *
 * @see {@link https://www.w3.org/WAI/ARIA/apg/patterns/meter/} ARIA Progressbar Pattern
 */

import React from 'react';
import { cn } from '../../../utils/cn';

/**
 * Props for the linear Progress component.
 *
 * @interface ProgressProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 *
 * @property {number} [value=0] - Current progress value (must be between 0 and max)
 * @property {number} [max=100] - Maximum value representing 100% completion
 * @property {('sm' | 'md' | 'lg')} [size='md'] - Visual size of the progress bar
 *   - `sm`: Height 0.5rem - Compact, for inline or dense layouts
 *   - `md`: Height 0.75rem - Standard size for most use cases
 *   - `lg`: Height 1rem - Prominent, for primary progress indicators
 *
 * @property {('default' | 'success' | 'warning' | 'error')} [variant='default'] - Visual color variant
 *   - `default`: Blue - Standard progress indication
 *   - `success`: Green - Successful completion, high performance
 *   - `warning`: Yellow - Warning state, attention needed
 *   - `error`: Red - Error state, critical issues
 *
 * @property {boolean} [showLabel=false] - Whether to display progress label above bar
 * @property {string} [label] - Custom label text (defaults to percentage if showLabel is true)
 * @property {boolean} [animate=false] - Whether to apply pulse animation to progress bar
 */
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  animate?: boolean;
}

/**
 * Linear progress bar component for visualizing task completion percentage.
 *
 * Displays a horizontal progress bar with configurable appearance, automatic percentage
 * calculation, and optional label display. Ideal for form completion, file uploads,
 * data processing, and any task with measurable progress.
 *
 * **Features:**
 * - Automatic percentage calculation from value/max
 * - Bounds checking (clamps between 0-100%)
 * - Smooth transitions between progress values
 * - Optional pulse animation for indeterminate progress
 * - Four semantic color variants
 * - Three size options for different contexts
 *
 * @component
 * @param {ProgressProps} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Forward ref to container div
 * @returns {JSX.Element} Rendered progress bar with optional label
 *
 * @accessibility
 * - Uses role="progressbar" for semantic meaning
 * - Provides aria-valuenow, aria-valuemin, aria-valuemax for current state
 * - Includes aria-label describing progress context
 * - Visual progress indicator doesn't rely solely on color
 *
 * @example Basic Progress
 * ```tsx
 * <Progress value={65} showLabel />
 * ```
 *
 * @example Custom Max Value
 * ```tsx
 * <Progress value={7} max={10} label="7 of 10 immunizations complete" showLabel />
 * ```
 *
 * @example Animated Progress
 * ```tsx
 * <Progress value={45} variant="default" animate showLabel size="lg" />
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = 0,
    max = 100,
    size = 'md',
    variant = 'default',
    showLabel = false,
    label,
    animate = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4'
    };

    const variantClasses = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600'
    };

    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{displayLabel}</span>
          </div>
        )}
        <div
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={Number.isFinite(value) ? Number(value) : 0}
          aria-valuemin={0}
          aria-valuemax={Number.isFinite(max) ? Number(max) : 100}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              variantClasses[variant],
              animate && 'animate-pulse'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

/**
 * Circular progress indicator component for compact progress visualization.
 *
 * Renders a circular/radial progress indicator using SVG. Ideal for compact spaces,
 * loading states, and dashboard widgets where horizontal space is limited. Supports
 * center label display and customizable size/stroke width.
 *
 * **Features:**
 * - SVG-based circular progress ring
 * - Customizable diameter and stroke width
 * - Smooth animated transitions
 * - Optional center label display
 * - Four semantic color variants
 * - Mathematically precise arc rendering
 *
 * @component
 * @param {Omit<ProgressProps, 'size'> & { size?: number; strokeWidth?: number }} props - Component props
 * @param {React.Ref<SVGSVGElement>} ref - Forward ref to SVG element
 * @returns {JSX.Element} Rendered circular progress indicator
 *
 * @accessibility
 * - Uses role="progressbar" on SVG element
 * - Provides aria-valuenow, aria-valuemin, aria-valuemax
 * - Includes aria-label for screen reader context
 * - Visual progress doesn't rely solely on color
 *
 * @remarks
 * The circular progress uses SVG path calculations:
 * - Radius = (size - strokeWidth) / 2
 * - Circumference = 2 * π * radius
 * - Stroke dash offset = circumference * (1 - percentage/100)
 *
 * @example Basic Circular Progress
 * ```tsx
 * <CircularProgress value={75} showLabel />
 * ```
 *
 * @example Large Circular Progress with Custom Stroke
 * ```tsx
 * <CircularProgress
 *   value={85}
 *   size={120}
 *   strokeWidth={8}
 *   variant="success"
 *   showLabel
 * />
 * ```
 *
 * @example Loading Indicator
 * ```tsx
 * <CircularProgress
 *   value={progressPercent}
 *   size={64}
 *   variant="default"
 *   animate
 *   showLabel
 * />
 * ```
 */
const CircularProgress = React.forwardRef<SVGSVGElement, Omit<ProgressProps, 'size'> & {
  size?: number;
  strokeWidth?: number;
}>(
  ({
    className,
    value = 0,
    max = 100,
    size = 48,
    strokeWidth = 4,
    variant = 'default',
    showLabel = false,
    label,
    animate = false,
    ...props
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variantColors = {
      default: 'stroke-blue-600',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-600',
      error: 'stroke-red-600'
    };

    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)} {...props}>
        <svg
          ref={ref}
          className="transform -rotate-90"
          width={size}
          height={size}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || `Progress: ${Math.round(percentage)}%`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-300 ease-out',
              variantColors[variant],
              animate && 'animate-pulse'
            )}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {displayLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

/**
 * Skeleton loading placeholder component for content being fetched.
 *
 * Provides an animated placeholder for content that's loading. Useful for improving
 * perceived performance by showing layout structure before data arrives. Supports
 * multiple shape variants for different content types.
 *
 * **Variants:**
 * - `text`: Rounded rectangle suitable for text lines
 * - `circular`: Circle for avatars, icons, profile pictures
 * - `rectangular`: Rounded rectangle for images, cards, blocks
 *
 * **Features:**
 * - Pulse animation by default (can be disabled)
 * - Customizable width and height
 * - Default dimensions based on variant
 * - Matches content shape for natural loading experience
 *
 * @component
 * @param {React.HTMLAttributes<HTMLDivElement> & { variant?: 'text' | 'circular' | 'rectangular'; width?: number | string; height?: number | string; animate?: boolean }} props - Component props
 * @param {React.Ref<HTMLDivElement>} ref - Forward ref to skeleton div
 * @returns {JSX.Element} Rendered skeleton placeholder
 *
 * @accessibility
 * - Skeleton is decorative, doesn't interfere with screen readers
 * - Should be paired with loading announcement for screen readers
 * - Doesn't receive keyboard focus
 *
 * @remarks
 * **Default Dimensions:**
 * - Text variant: height 1em (matches line height)
 * - Circular variant: 2.5rem × 2.5rem (avatar size)
 * - Rectangular variant: height 1.25rem (card/block height)
 *
 * **Best Practices:**
 * - Match skeleton shapes to actual content layout
 * - Use multiple skeletons to show content structure
 * - Provide loading announcement for screen readers
 * - Replace with actual content when loaded
 *
 * @example Text Skeleton
 * ```tsx
 * <Skeleton variant="text" width="80%" />
 * <Skeleton variant="text" width="60%" />
 * ```
 *
 * @example Circular Avatar Skeleton
 * ```tsx
 * <Skeleton variant="circular" width={48} height={48} />
 * ```
 *
 * @example Card Skeleton
 * ```tsx
 * <div className="space-y-4">
 *   <Skeleton variant="rectangular" height={200} />
 *   <Skeleton variant="text" width="90%" />
 *   <Skeleton variant="text" width="70%" />
 * </div>
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  animate?: boolean;
}>(
  ({
    className,
    variant = 'rectangular',
    width,
    height,
    animate = true,
    ...props
  }, ref) => {
    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    // Default dimensions based on variant
    if (variant === 'text' && !height) style.height = '1em';
    if (variant === 'circular' && !width && !height) {
      style.width = '2.5rem';
      style.height = '2.5rem';
    }
    if (variant === 'rectangular' && !height) style.height = '1.25rem';

    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-200',
          variantClasses[variant],
          animate && 'animate-pulse',
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);

Progress.displayName = 'Progress';
CircularProgress.displayName = 'CircularProgress';
Skeleton.displayName = 'Skeleton';

export {
  Progress,
  CircularProgress,
  Skeleton,
  type ProgressProps
};
