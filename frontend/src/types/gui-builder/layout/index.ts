/**
 * Layout Module
 *
 * This module provides types for page configuration, component trees,
 * containers, and responsive design.
 *
 * @module gui-builder/layout
 */

// Responsive design types
export type {
  BreakpointConfig,
  ResponsiveValue,
  ResponsiveLayoutConfig,
  ResponsiveImage,
  ResponsiveImageSet,
  ResponsiveTypography,
  ResponsiveSpacing,
  ViewportInfo,
} from './responsive';

export {
  Breakpoint,
  DEFAULT_BREAKPOINTS,
  getBreakpointFromWidth,
  getResponsiveValue,
  isBreakpointActive,
} from './responsive';

// Component tree types
export type {
  ComponentInstance,
  ComponentTreeNode,
  ComponentTree,
  TreeTraversalOptions,
  TreeSearchResult,
  TreeChangeEvent,
  InsertNodeOptions,
  MoveNodeOptions,
  TreeOperationValidation,
} from './tree';

export {
  TreeTraversalOrder,
  TreeOperation,
  findNodeById,
  isAncestor,
  getAncestors,
  getDescendants,
} from './tree';

// Page configuration types
export type {
  PageSEO,
  PageRouting,
  PageLayout,
  PageDataConfig,
  PageAccessibility,
  PageConfig,
  PageCollection,
} from './page';

export { PageType, PageRenderMode } from './page';

// Container types
export type {
  FlexContainerConfig,
  GridContainerConfig,
  StackContainerConfig,
  ContainerConstraints,
  ContainerConfig,
  SlotConfig,
  SectionConfig,
} from './containers';

export { ContainerLayout } from './containers';
