/**
 * Lazy-loaded Modal and Dialog Components
 *
 * This module provides lazy-loaded wrappers for heavy modal/dialog components.
 * Modals are typically triggered by user action and don't need to be in the
 * initial bundle. This reduces the main bundle size significantly.
 *
 * PERFORMANCE IMPACT:
 * - Each modal: 20-100KB of code
 * - Initial load improvement: Modals load only when opened
 * - Better interaction responsiveness
 *
 * WHEN TO USE:
 * ✅ Complex modals with forms (500+ lines)
 * ✅ Modals with heavy dependencies (charts, editors)
 * ✅ Feature-specific modals not used on every page
 * ✅ Settings/configuration modals
 *
 * USAGE:
 * ```tsx
 * import { LazyStudentFormModal } from '@/components/lazy/LazyModals'
 *
 * function StudentListPage() {
 *   const [isOpen, setIsOpen] = useState(false)
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Add Student</Button>
 *       {isOpen && (
 *         <Suspense fallback={<ModalSkeleton />}>
 *           <LazyStudentFormModal onClose={() => setIsOpen(false)} />
 *         </Suspense>
 *       )}
 *     </>
 *   )
 * }
 * ```
 *
 * @module components/lazy/LazyModals
 * @since 1.2.0
 */

'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/feedback';

/**
 * Modal loading fallback
 */
const ModalLoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// STUDENT MODALS
// ============================================================================

/**
 * Student form modal for creating/editing students
 * Heavy component with complex validation
 */
export const LazyStudentFormModal = dynamic(
  () => import('@/components/features/students/StudentForm').then(mod => ({ default: mod.StudentForm })),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// COMMUNICATION MODALS
// ============================================================================

/**
 * Message composer modal
 * Includes rich text editor and attachments
 */
export const LazyMessageComposerModal = dynamic(
  () => import('@/components/features/communication/components/MessageComposer'),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

/**
 * Broadcast manager modal
 * Complex form with recipient selection
 */
export const LazyBroadcastManagerModal = dynamic(
  () => import('@/components/features/communication/components/BroadcastManager'),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// NOTIFICATION MODALS
// ============================================================================

/**
 * Notification center modal
 * Shows all notifications with filtering
 */
export const LazyNotificationCenter = dynamic(
  () => import('@/features/notifications/components/NotificationCenter').then(mod => ({ default: mod.NotificationCenter })),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

/**
 * Notification settings modal
 */
export const LazyNotificationSettings = dynamic(
  () => import('@/features/notifications/components/NotificationSettings').then(mod => ({ default: mod.NotificationSettings })),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

// ============================================================================
// SEARCH MODALS
// ============================================================================

/**
 * Advanced search modal
 * Complex filters and search options
 */
export const LazyAdvancedSearch = dynamic(
  () => import('@/features/search/components').then(mod => ({ default: mod.AdvancedSearch })),
  {
    loading: () => <ModalLoadingFallback />,
    ssr: false,
  }
);

/**
 * Modal Skeleton Component
 * Export for use in other loading states
 */
export { ModalLoadingFallback as ModalSkeleton };
