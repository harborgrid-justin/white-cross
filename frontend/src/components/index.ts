/**
 * White Cross Components - Main Export Index
 * 
 * This file provides centralized exports for all components following
 * enterprise architectural patterns and service-oriented design.
 * 
 * Import Pattern Examples:
 * - UI Components: import { Button, LoadingSpinner } from '@/components/ui'
 * - Layout: import { AppLayout, PageLayout } from '@/components/layout'
 * - Features: import { StudentTable } from '@/components/features/students'
 * - Forms: import { StudentForm } from '@/components/forms'
 */

// UI Components (Design System)
export * from './ui'

// Layout Components
export * from './layout'

// Feature Components
export * from './features'

// Form Components
export * from './forms'

// Shared Business Components
export * from './shared'

// Providers and HOCs
export * from './providers'

// Pages
export * from './pages'

// Legacy exports for backward compatibility (TODO: Remove after migration)
export { Layout } from './layout'
export { LoadingSpinner } from './ui/feedback'
export { default as ErrorBoundary } from './providers/ErrorBoundary'