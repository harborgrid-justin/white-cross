/**
 * Container Types
 *
 * This module defines specialized container components that hold and
 * organize child components with specific layout behaviors.
 *
 * @module gui-builder/layout/containers
 */

import type { ComponentInstanceId } from '../core';

/**
 * Container layout type.
 */
export enum ContainerLayout {
  /**
   * Block layout (stacks vertically).
   */
  Block = 'block',

  /**
   * Flexbox layout.
   */
  Flex = 'flex',

  /**
   * CSS Grid layout.
   */
  Grid = 'grid',

  /**
   * Absolute positioning.
   */
  Absolute = 'absolute',

  /**
   * Stack layout (children overlay each other).
   */
  Stack = 'stack',

  /**
   * Masonry layout.
   */
  Masonry = 'masonry',
}

/**
 * Flexbox container configuration.
 */
export interface FlexContainerConfig {
  /**
   * Flex direction.
   */
  readonly direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /**
   * Justify content.
   */
  readonly justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';

  /**
   * Align items.
   */
  readonly align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

  /**
   * Align content (for multi-line flex containers).
   */
  readonly alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'stretch';

  /**
   * Flex wrap.
   */
  readonly wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /**
   * Gap between items.
   */
  readonly gap?: string | number;

  /**
   * Row gap.
   */
  readonly rowGap?: string | number;

  /**
   * Column gap.
   */
  readonly columnGap?: string | number;
}

/**
 * Grid container configuration.
 */
export interface GridContainerConfig {
  /**
   * Number of columns or template.
   */
  readonly columns?: number | string;

  /**
   * Number of rows or template.
   */
  readonly rows?: number | string;

  /**
   * Gap between cells.
   */
  readonly gap?: string | number;

  /**
   * Row gap.
   */
  readonly rowGap?: string | number;

  /**
   * Column gap.
   */
  readonly columnGap?: string | number;

  /**
   * Auto-flow direction.
   */
  readonly autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';

  /**
   * Auto-columns sizing.
   */
  readonly autoColumns?: string;

  /**
   * Auto-rows sizing.
   */
  readonly autoRows?: string;

  /**
   * Justify items.
   */
  readonly justifyItems?: 'start' | 'end' | 'center' | 'stretch';

  /**
   * Align items.
   */
  readonly alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';

  /**
   * Justify content.
   */
  readonly justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';

  /**
   * Align content.
   */
  readonly alignContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

/**
 * Stack container configuration.
 */
export interface StackContainerConfig {
  /**
   * Spacing between stacked items.
   */
  readonly spacing?: string | number;

  /**
   * Z-index base value.
   */
  readonly zIndexBase?: number;

  /**
   * Whether to reverse the stacking order.
   */
  readonly reverse?: boolean;
}

/**
 * Container constraints for child components.
 */
export interface ContainerConstraints {
  /**
   * Minimum number of children required.
   */
  readonly minChildren?: number;

  /**
   * Maximum number of children allowed.
   */
  readonly maxChildren?: number;

  /**
   * Allowed child component types.
   */
  readonly allowedChildTypes?: readonly string[];

  /**
   * Whether children can be reordered.
   */
  readonly allowReordering?: boolean;

  /**
   * Whether children can be added/removed.
   */
  readonly allowModification?: boolean;
}

/**
 * Container configuration.
 */
export interface ContainerConfig {
  /**
   * Layout type.
   */
  readonly layout: ContainerLayout;

  /**
   * Flexbox configuration (if layout is Flex).
   */
  readonly flex?: FlexContainerConfig;

  /**
   * Grid configuration (if layout is Grid).
   */
  readonly grid?: GridContainerConfig;

  /**
   * Stack configuration (if layout is Stack).
   */
  readonly stack?: StackContainerConfig;

  /**
   * Container constraints.
   */
  readonly constraints?: ContainerConstraints;

  /**
   * Padding inside the container.
   */
  readonly padding?: string | number;

  /**
   * Overflow behavior.
   */
  readonly overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';

  /**
   * Whether the container is scrollable.
   */
  readonly scrollable?: boolean;

  /**
   * Maximum height (triggers scrolling if exceeded).
   */
  readonly maxHeight?: string | number;
}

/**
 * Slot configuration for named slots in containers.
 */
export interface SlotConfig {
  /**
   * Slot name.
   */
  readonly name: string;

  /**
   * Display label.
   */
  readonly label?: string;

  /**
   * Description of the slot's purpose.
   */
  readonly description?: string;

  /**
   * Whether the slot is required.
   */
  readonly required?: boolean;

  /**
   * Component instances in this slot.
   */
  readonly components: readonly ComponentInstanceId[];

  /**
   * Allowed component types for this slot.
   */
  readonly allowedTypes?: readonly string[];

  /**
   * Maximum number of components in this slot.
   */
  readonly maxComponents?: number;

  /**
   * Default layout for components in this slot.
   */
  readonly defaultLayout?: ContainerLayout;
}

/**
 * Section container (page section with semantic meaning).
 */
export interface SectionConfig {
  /**
   * Section identifier.
   */
  readonly id: string;

  /**
   * Semantic HTML tag to use.
   */
  readonly tag?: 'section' | 'article' | 'aside' | 'nav' | 'header' | 'footer' | 'main';

  /**
   * Container configuration for the section content.
   */
  readonly container: ContainerConfig;

  /**
   * Whether the section spans full width.
   */
  readonly fullWidth?: boolean;

  /**
   * Background configuration.
   */
  readonly background?: {
    readonly color?: string;
    readonly image?: string;
    readonly gradient?: string;
    readonly overlay?: string;
  };

  /**
   * Spacing configuration.
   */
  readonly spacing?: {
    readonly paddingTop?: string | number;
    readonly paddingBottom?: string | number;
    readonly paddingLeft?: string | number;
    readonly paddingRight?: string | number;
    readonly marginTop?: string | number;
    readonly marginBottom?: string | number;
  };
}
