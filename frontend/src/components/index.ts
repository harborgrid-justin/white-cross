/**
 * White Cross Components - Main Export Index
 *
 * PERFORMANCE OPTIMIZATION NOTE:
 * This file has been refactored to use specific named exports instead of wildcard exports
 * to enable better tree-shaking and reduce bundle size. Each export is explicit to help
 * bundlers identify unused code.
 *
 * SHADCN/UI BEST PRACTICES:
 * All shadcn/ui components are in the flat structure at @/components/ui/
 * Import directly from specific component files for optimal performance.
 *
 * Import Pattern Examples (RECOMMENDED):
 * - UI Components: import { Button } from '@/components/ui/button'
 * - Specific imports: import { Card } from '@/components/ui/card'
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

// Buttons (shadcn/ui - flat structure)
export { Button } from './ui/button'

// Feedback Components (shadcn/ui)
export { Skeleton } from './ui/skeleton'
export { Toaster } from './ui/sonner'

// Custom UI Components
export { EmptyState } from './ui/empty-state'
export { Spinner } from './ui/spinner'

// Layout Components
export { Layout, AppLayout, PageHeader } from './layouts'

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
// - import { Input } from '@/components/ui/input'
// - import { Card } from '@/components/ui/card'
// - import { StudentList } from '@/components/features/students'
//
// Subdirectories (ui/buttons/, ui/inputs/, ui/feedback/, etc.) contain legacy
// custom implementations. Prefer shadcn/ui components from flat structure.
//
// This approach ensures optimal tree-shaking and smaller bundle sizes.
