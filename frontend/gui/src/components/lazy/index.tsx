/**
 * Lazy-Loaded Components
 *
 * This module provides lazy-loaded versions of heavy components to improve
 * initial bundle size and application performance.
 *
 * Usage:
 * ```tsx
 * import { LazyPreviewModal } from '@/components/lazy';
 *
 * // Component will be loaded only when rendered
 * <LazyPreviewModal isOpen={isOpen} onClose={handleClose} />
 * ```
 */

import React from 'react';
import {
  withLazyLoad,
  withLazyLoadAndErrorBoundary,
  ModalLoading,
  PanelLoading,
  PageLoading,
  InlineLoading,
} from '../common/LazyLoad';

// ============================================================================
// PREVIEW COMPONENTS
// ============================================================================

/**
 * Lazy-loaded PreviewModal
 * Heavy component with iframe rendering and device simulation
 */
export const LazyPreviewModal = withLazyLoadAndErrorBoundary(
  React.lazy(() => import('../preview/PreviewModal')),
  <ModalLoading />
);

/**
 * Lazy-loaded PreviewFrame
 * Component for rendering preview content
 */
export const LazyPreviewFrame = withLazyLoad(
  React.lazy(() => import('../preview/PreviewFrame')),
  <PanelLoading />
);

// ============================================================================
// CODE GENERATION (if applicable)
// ============================================================================

/**
 * Lazy-loaded CodeGenerator
 * Heavy component with syntax highlighting and code generation
 *
 * Note: Only include this if CodeGenerator component exists and is heavy
 */
// export const LazyCodeGenerator = withLazyLoad(
//   React.lazy(() => import('../codegen/CodeGenerator')),
//   <PanelLoading />
// );

// ============================================================================
// RE-EXPORTS
// ============================================================================

/**
 * Re-export loading components for convenience
 */
export {
  ModalLoading,
  PanelLoading,
  PageLoading,
  InlineLoading,
  Spinner,
  preloadComponent,
  usePreloadComponent,
} from '../common/LazyLoad';

/**
 * Preload functions for heavy components
 * Can be called on user interactions (hover, click) to improve perceived performance
 */
export const preloadPreviewModal = () =>
  import('../preview/PreviewModal').catch(console.error);

export const preloadPreviewFrame = () =>
  import('../preview/PreviewFrame').catch(console.error);

// export const preloadCodeGenerator = () =>
//   import('../codegen/CodeGenerator').catch(console.error);
