/**
 * Layout Components Module
 *
 * Exports all layout-related components that control page structure,
 * navigation, and application shell. These components provide the
 * foundational structure for the entire application.
 *
 * @module layout
 *
 * Core Components:
 * - AppLayout: Main application shell with navigation, sidebar, and global modals
 * - Navigation: Top navigation bar with search, notifications, and user menu
 * - Sidebar: Collapsible sidebar with hierarchical navigation for all 21 domains
 * - PageHeader: Consistent page header with breadcrumbs, title, and actions
 * - PageContainer: Responsive content wrapper with max-width and padding
 * - Footer: Application footer with links and copyright
 * - Breadcrumbs: Hierarchical breadcrumb trail navigation
 * - SearchBar: Global search modal with keyboard shortcuts
 * - NotificationCenter: Notification dropdown with read/unread management
 *
 * Features:
 * - Responsive design (mobile and desktop)
 * - Dark mode support
 * - Role-based access control
 * - Keyboard shortcuts
 * - Accessibility (ARIA labels, semantic HTML)
 * - Smooth animations and transitions
 *
 * @example
 * ```tsx
 * import { AppLayout, PageHeader, PageContainer } from '@/components/layout'
 *
 * function DashboardPage() {
 *   return (
 *     <AppLayout>
 *       <PageContainer>
 *         <PageHeader
 *           title="Dashboard"
 *           description="Overview of system activity"
 *         />
 *         <DashboardContent />
 *       </PageContainer>
 *     </AppLayout>
 *   )
 * }
 * ```
 */

export { default as AppLayout } from './AppLayout'

// Legacy export for backward compatibility
export { default as Layout } from './AppLayout'