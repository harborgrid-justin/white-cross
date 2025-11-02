/**
 * UI Components - Design System Exports
 *
 * PERFORMANCE OPTIMIZATION:
 * This file uses specific named exports instead of wildcard exports for better tree-shaking.
 * Import directly from sub-modules for optimal bundle size.
 *
 * RECOMMENDED: Import from specific paths
 * - import { Button } from '@/components/ui/buttons'
 * - import { Input } from '@/components/ui/inputs'
 * - import { Card } from '@/components/ui/layout'
 */

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE (Most commonly used components)
// ============================================================================

// Buttons (from ./buttons)
export { Button } from './buttons'
export { BackButton } from './buttons'

// Inputs (from ./inputs)
export { Input } from './inputs'
export { Textarea } from './inputs'
export { Select } from './inputs'
export { Checkbox } from './inputs'
export { Label } from './inputs'
export { SearchInput } from './inputs'

// Feedback (from ./feedback)
export { LoadingSpinner } from './feedback'
export { EmptyState } from './feedback'
export { AlertBanner } from './feedback'
export { Alert, AlertTitle, AlertDescription } from './feedback'
export { Skeleton } from './feedback'
export { Progress } from './feedback'
export { Toast, ToastProvider, useToast } from './feedback'

// Layout (from ./layout)
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './layout'
export { Separator } from './layout'

// Navigation (from ./navigation)
export { Tabs, TabsList, TabsTrigger, TabsContent } from './navigation'

// Overlays (from ./overlays)
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './overlays'
export { Modal } from './overlays'

// ============================================================================
// PERFORMANCE NOTE:
// ============================================================================
// For better performance and smaller bundles, prefer importing directly from
// specific sub-modules rather than from '@/components/ui':
//
// GOOD:  import { Button } from '@/components/ui/buttons'
// OK:    import { Button } from '@/components/ui'
// AVOID: import { Button, Input, Card, ... } from '@/components/ui'
//
// Each sub-module has its own index.ts with properly typed exports.
