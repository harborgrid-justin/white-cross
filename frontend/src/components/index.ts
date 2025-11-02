/**
 * White Cross Components - Main Export Index
 *
 * PERFORMANCE OPTIMIZATION NOTE:
 * This file has been refactored to use specific named exports instead of wildcard exports
 * to enable better tree-shaking and reduce bundle size. Each export is explicit to help
 * bundlers identify unused code.
 *
 * Import Pattern Examples (RECOMMENDED):
 * - UI Components: import { Button } from '@/components/ui/buttons'
 * - Specific imports: import { LoadingSpinner } from '@/components/ui/feedback'
 * - Layout: import { AppLayout } from '@/components/layouts'
 * - Features: Use direct imports from feature directories
 *
 * AVOID importing from '@/components' directly - use specific paths for better performance.
 */

// ============================================================================
// COMMONLY USED UI COMPONENTS (Direct exports for convenience)
// ============================================================================
// These are the most frequently used components across the application.
// Direct exports here to balance convenience with performance.

// Buttons
export { Button } from './ui/buttons'
export { BackButton } from './ui/buttons'

// Feedback Components
export { LoadingSpinner } from './ui/feedback'
export { EmptyState } from './ui/feedback'
export { AlertBanner } from './ui/feedback'
export { Skeleton } from './ui/feedback'
export { Toast, ToastProvider, useToast } from './ui/feedback'

// Layout Components
export { Layout, AppLayout } from './layouts'
export { PageHeader } from './shared/PageHeader'

// ============================================================================
// ERROR HANDLING & SECURITY
// ============================================================================

export { default as ErrorBoundary } from './providers/ErrorBoundary'
export { AccessDenied } from './shared/security'
export { SessionExpiredModal } from './shared/security'
export { BackendConnectionError } from './shared/errors'
export { GlobalErrorBoundary } from './shared/errors'

// ============================================================================
// PERFORMANCE NOTE:
// ============================================================================
// For all other components, import directly from their specific locations:
// - import { Input } from '@/components/ui/inputs'
// - import { Card } from '@/components/ui/layout'
// - import { StudentList } from '@/components/features/students'
//
// This approach ensures optimal tree-shaking and smaller bundle sizes.
