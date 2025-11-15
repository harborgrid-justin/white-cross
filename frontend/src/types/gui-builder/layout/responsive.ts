/**
 * Responsive Design Types
 *
 * This module defines types for responsive breakpoints and configurations
 * that enable components to adapt to different screen sizes.
 *
 * @module gui-builder/layout/responsive
 */

import type { PropertyValue } from '../properties';

/**
 * Standard breakpoint names following Tailwind CSS conventions.
 */
export enum Breakpoint {
  /**
   * Extra small devices (< 640px).
   */
  XS = 'xs',

  /**
   * Small devices (>= 640px).
   */
  SM = 'sm',

  /**
   * Medium devices (>= 768px).
   */
  MD = 'md',

  /**
   * Large devices (>= 1024px).
   */
  LG = 'lg',

  /**
   * Extra large devices (>= 1280px).
   */
  XL = 'xl',

  /**
   * 2X extra large devices (>= 1536px).
   */
  XXL = '2xl',
}

/**
 * Breakpoint configuration with pixel values.
 */
export interface BreakpointConfig {
  /**
   * Breakpoint name.
   */
  readonly name: Breakpoint;

  /**
   * Minimum width in pixels.
   */
  readonly minWidth: number;

  /**
   * Maximum width in pixels (optional).
   */
  readonly maxWidth?: number;

  /**
   * Display label for UI.
   */
  readonly label: string;

  /**
   * Icon for the breakpoint.
   */
  readonly icon?: string;

  /**
   * Whether this is the default breakpoint.
   */
  readonly isDefault?: boolean;
}

/**
 * Default Tailwind-style breakpoint configurations.
 */
export const DEFAULT_BREAKPOINTS: readonly BreakpointConfig[] = [
  {
    name: Breakpoint.XS,
    minWidth: 0,
    maxWidth: 639,
    label: 'Mobile',
    icon: 'smartphone',
    isDefault: true,
  },
  {
    name: Breakpoint.SM,
    minWidth: 640,
    maxWidth: 767,
    label: 'Small Tablet',
    icon: 'tablet',
  },
  {
    name: Breakpoint.MD,
    minWidth: 768,
    maxWidth: 1023,
    label: 'Tablet',
    icon: 'tablet',
  },
  {
    name: Breakpoint.LG,
    minWidth: 1024,
    maxWidth: 1279,
    label: 'Laptop',
    icon: 'laptop',
  },
  {
    name: Breakpoint.XL,
    minWidth: 1280,
    maxWidth: 1535,
    label: 'Desktop',
    icon: 'monitor',
  },
  {
    name: Breakpoint.XXL,
    minWidth: 1536,
    label: 'Large Desktop',
    icon: 'monitor',
  },
] as const;

/**
 * Responsive value configuration for a property.
 */
export interface ResponsiveValue<T = PropertyValue> {
  /**
   * Base/default value (applies to all breakpoints unless overridden).
   */
  readonly base: T;

  /**
   * Breakpoint-specific overrides.
   */
  readonly breakpoints?: Partial<Record<Breakpoint, T>>;
}

/**
 * Responsive configuration for layout properties.
 */
export interface ResponsiveLayoutConfig {
  /**
   * Display mode per breakpoint.
   */
  readonly display?: ResponsiveValue<
    'block' | 'inline' | 'flex' | 'grid' | 'none' | 'inline-block'
  >;

  /**
   * Width per breakpoint.
   */
  readonly width?: ResponsiveValue<string | number>;

  /**
   * Height per breakpoint.
   */
  readonly height?: ResponsiveValue<string | number>;

  /**
   * Padding per breakpoint.
   */
  readonly padding?: ResponsiveValue<string | number>;

  /**
   * Margin per breakpoint.
   */
  readonly margin?: ResponsiveValue<string | number>;

  /**
   * Grid columns per breakpoint.
   */
  readonly gridColumns?: ResponsiveValue<number>;

  /**
   * Flex direction per breakpoint.
   */
  readonly flexDirection?: ResponsiveValue<
    'row' | 'column' | 'row-reverse' | 'column-reverse'
  >;

  /**
   * Whether to hide at specific breakpoints.
   */
  readonly hidden?: ResponsiveValue<boolean>;

  /**
   * Custom CSS classes per breakpoint.
   */
  readonly classes?: ResponsiveValue<string | readonly string[]>;
}

/**
 * Responsive image configuration.
 */
export interface ResponsiveImage {
  /**
   * Source URL or path.
   */
  readonly src: string;

  /**
   * Breakpoint this image applies to.
   */
  readonly breakpoint: Breakpoint;

  /**
   * Image width.
   */
  readonly width?: number;

  /**
   * Image height.
   */
  readonly height?: number;

  /**
   * Media query for this source.
   */
  readonly mediaQuery?: string;
}

/**
 * Responsive images srcset configuration.
 */
export interface ResponsiveImageSet {
  /**
   * Default/fallback image.
   */
  readonly default: string;

  /**
   * Responsive sources.
   */
  readonly sources: readonly ResponsiveImage[];

  /**
   * Sizes attribute for responsive images.
   */
  readonly sizes?: string;

  /**
   * Alt text.
   */
  readonly alt: string;

  /**
   * Loading strategy.
   */
  readonly loading?: 'lazy' | 'eager';
}

/**
 * Responsive typography configuration.
 */
export interface ResponsiveTypography {
  /**
   * Font size per breakpoint.
   */
  readonly fontSize?: ResponsiveValue<string | number>;

  /**
   * Line height per breakpoint.
   */
  readonly lineHeight?: ResponsiveValue<string | number>;

  /**
   * Font weight per breakpoint.
   */
  readonly fontWeight?: ResponsiveValue<number | string>;

  /**
   * Letter spacing per breakpoint.
   */
  readonly letterSpacing?: ResponsiveValue<string>;
}

/**
 * Responsive spacing scale.
 */
export interface ResponsiveSpacing {
  /**
   * Spacing values per breakpoint.
   */
  readonly scale: Record<Breakpoint, Record<string, string>>;
}

/**
 * Viewport detection helper.
 */
export interface ViewportInfo {
  /**
   * Current viewport width in pixels.
   */
  readonly width: number;

  /**
   * Current viewport height in pixels.
   */
  readonly height: number;

  /**
   * Current active breakpoint.
   */
  readonly breakpoint: Breakpoint;

  /**
   * Whether the viewport is in portrait orientation.
   */
  readonly isPortrait: boolean;

  /**
   * Whether the viewport is in landscape orientation.
   */
  readonly isLandscape: boolean;

  /**
   * Device pixel ratio.
   */
  readonly pixelRatio: number;
}

/**
 * Helper to determine the current breakpoint from width.
 */
export function getBreakpointFromWidth(
  width: number,
  breakpoints: readonly BreakpointConfig[] = DEFAULT_BREAKPOINTS,
): Breakpoint {
  for (let i = breakpoints.length - 1; i >= 0; i--) {
    const bp = breakpoints[i];
    if (bp && width >= bp.minWidth) {
      return bp.name;
    }
  }
  return Breakpoint.XS;
}

/**
 * Helper to get the responsive value for a given breakpoint.
 */
export function getResponsiveValue<T>(
  config: ResponsiveValue<T>,
  breakpoint: Breakpoint,
): T {
  return config.breakpoints?.[breakpoint] ?? config.base;
}

/**
 * Helper to check if a breakpoint is active based on width.
 */
export function isBreakpointActive(
  breakpoint: Breakpoint,
  width: number,
  breakpoints: readonly BreakpointConfig[] = DEFAULT_BREAKPOINTS,
): boolean {
  const config = breakpoints.find((bp) => bp.name === breakpoint);
  if (!config) return false;

  const inRange = width >= config.minWidth;
  const belowMax = config.maxWidth ? width <= config.maxWidth : true;

  return inRange && belowMax;
}
