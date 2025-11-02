/**
 * Button Components Module
 *
 * Comprehensive collection of button components for the White Cross healthcare platform.
 * Provides accessible, themeable, and flexible button implementations for various use cases.
 *
 * **Components:**
 * - Button: Primary button with variants, sizes, loading states, and icons
 * - BackButton: Navigation button with state restoration and history management
 * - RollbackButton: Undo button for optimistic update rollback
 * - BatchRollbackButton: Bulk undo for multiple updates
 *
 * **Hooks:**
 * - useRollback: Programmatic rollback functionality
 *
 * **Features:**
 * - Consistent theming and styling
 * - Accessibility (ARIA attributes, keyboard navigation)
 * - Dark mode support
 * - Loading states and animations
 * - TypeScript type safety
 *
 * @module components/ui/buttons
 *
 * @example
 * ```tsx
 * import { Button, BackButton, RollbackButton } from '@/components/ui/buttons';
 *
 * function MyPage() {
 *   return (
 *     <div>
 *       <BackButton fallbackPath="/dashboard" />
 *       <Button variant="default" onClick={handleSave}>Save</Button>
 *       <RollbackButton updateId="update-123" variant="danger" />
 *     </div>
 *   );
 * }
 * ```
 */

export { default as Button } from './Button'
export { default as BackButton } from './BackButton'
export { RollbackButton, BatchRollbackButton, useRollback } from './RollbackButton'

// Re-export types for external use
export type { ButtonProps } from './Button'
export type {
  BackButtonProps,
  IconBackButtonProps,
  BackButtonWithConfirmationProps
} from './BackButton'
export type {
  RollbackButtonProps,
  BatchRollbackButtonProps
} from './RollbackButton'



