/**
 * Component Metadata Types
 *
 * This module defines metadata structures that describe component
 * characteristics, capabilities, and requirements.
 *
 * @module gui-builder/components/metadata
 */

import type { ComponentId } from '../core';
import type { ComponentTaxonomy } from './categories';

/**
 * Rendering mode for components.
 */
export enum RenderMode {
  /**
   * Server Component (React Server Component).
   */
  Server = 'server',

  /**
   * Client Component (requires 'use client').
   */
  Client = 'client',

  /**
   * Can be either server or client.
   */
  Hybrid = 'hybrid',
}

/**
 * Component capabilities flags.
 */
export interface ComponentCapabilities {
  /**
   * Can contain child components.
   */
  readonly canHaveChildren: boolean;

  /**
   * Can be nested inside other components.
   */
  readonly canBeNested: boolean;

  /**
   * Supports drag and drop of child elements.
   */
  readonly supportsDragDrop: boolean;

  /**
   * Can be duplicated/cloned.
   */
  readonly canBeDuplicated: boolean;

  /**
   * Can be deleted by user.
   */
  readonly canBeDeleted: boolean;

  /**
   * Supports responsive breakpoints.
   */
  readonly supportsResponsive: boolean;

  /**
   * Supports theming/styling.
   */
  readonly supportsTheming: boolean;

  /**
   * Supports data binding.
   */
  readonly supportsDataBinding: boolean;

  /**
   * Supports conditional rendering.
   */
  readonly supportsConditionalRendering: boolean;

  /**
   * Can trigger Server Actions.
   */
  readonly supportsServerActions: boolean;
}

/**
 * Default component capabilities (all features enabled).
 */
export const DefaultCapabilities: ComponentCapabilities = {
  canHaveChildren: false,
  canBeNested: true,
  supportsDragDrop: false,
  canBeDuplicated: true,
  canBeDeleted: true,
  supportsResponsive: true,
  supportsTheming: true,
  supportsDataBinding: true,
  supportsConditionalRendering: true,
  supportsServerActions: false,
};

/**
 * Constraints on component usage.
 */
export interface ComponentConstraints {
  /**
   * Maximum number of children allowed.
   */
  readonly maxChildren?: number;

  /**
   * Minimum number of children required.
   */
  readonly minChildren?: number;

  /**
   * Allowed parent component types (ComponentIds).
   * If undefined, can be placed anywhere.
   */
  readonly allowedParents?: readonly ComponentId[];

  /**
   * Disallowed parent component types.
   */
  readonly disallowedParents?: readonly ComponentId[];

  /**
   * Allowed child component types.
   * If undefined, any component can be a child.
   */
  readonly allowedChildren?: readonly ComponentId[];

  /**
   * Disallowed child component types.
   */
  readonly disallowedChildren?: readonly ComponentId[];

  /**
   * Maximum nesting depth.
   */
  readonly maxDepth?: number;

  /**
   * Requires specific Next.js version.
   */
  readonly requiresNextVersion?: string;

  /**
   * Requires specific React version.
   */
  readonly requiresReactVersion?: string;
}

/**
 * Display information for component in the builder UI.
 */
export interface ComponentDisplay {
  /**
   * Display name shown in the component palette.
   */
  readonly name: string;

  /**
   * Short description of the component.
   */
  readonly description: string;

  /**
   * Icon identifier or URL.
   */
  readonly icon?: string;

  /**
   * Preview image URL.
   */
  readonly previewImage?: string;

  /**
   * Color theme for the component in the UI.
   */
  readonly themeColor?: string;

  /**
   * Display group for organization in the palette.
   */
  readonly group?: string;

  /**
   * Display order within the group (lower = earlier).
   */
  readonly order?: number;
}

/**
 * Documentation for the component.
 */
export interface ComponentDocumentation {
  /**
   * Long-form description with usage guidelines.
   */
  readonly description: string;

  /**
   * Code examples showing component usage.
   */
  readonly examples?: readonly {
    readonly title: string;
    readonly description?: string;
    readonly code: string;
  }[];

  /**
   * URL to external documentation.
   */
  readonly externalDocsUrl?: string;

  /**
   * Best practices and recommendations.
   */
  readonly bestPractices?: readonly string[];

  /**
   * Known limitations or gotchas.
   */
  readonly limitations?: readonly string[];

  /**
   * Accessibility notes.
   */
  readonly a11yNotes?: string;
}

/**
 * Performance characteristics and recommendations.
 */
export interface ComponentPerformance {
  /**
   * Estimated render cost (1-10, higher = more expensive).
   */
  readonly renderCost?: number;

  /**
   * Whether the component is memoized.
   */
  readonly isMemoized?: boolean;

  /**
   * Recommended maximum instances per page.
   */
  readonly recommendedMaxInstances?: number;

  /**
   * Performance notes and optimization tips.
   */
  readonly notes?: string;
}

/**
 * Dependencies required by the component.
 */
export interface ComponentDependencies {
  /**
   * NPM packages required.
   */
  readonly packages?: readonly {
    readonly name: string;
    readonly version?: string;
    readonly optional?: boolean;
  }[];

  /**
   * Other components this component depends on.
   */
  readonly components?: readonly ComponentId[];

  /**
   * CSS files or styles required.
   */
  readonly styles?: readonly string[];

  /**
   * External scripts required.
   */
  readonly scripts?: readonly {
    readonly src: string;
    readonly async?: boolean;
    readonly defer?: boolean;
  }[];
}

/**
 * Complete component metadata.
 */
export interface ComponentMetadata {
  /**
   * Unique identifier for the component.
   */
  readonly id: ComponentId;

  /**
   * Display information.
   */
  readonly display: ComponentDisplay;

  /**
   * Taxonomy and classification.
   */
  readonly taxonomy: ComponentTaxonomy;

  /**
   * Rendering mode.
   */
  readonly renderMode: RenderMode;

  /**
   * Component capabilities.
   */
  readonly capabilities: ComponentCapabilities;

  /**
   * Usage constraints.
   */
  readonly constraints?: ComponentConstraints;

  /**
   * Documentation.
   */
  readonly documentation?: ComponentDocumentation;

  /**
   * Performance characteristics.
   */
  readonly performance?: ComponentPerformance;

  /**
   * Dependencies.
   */
  readonly dependencies?: ComponentDependencies;

  /**
   * Version of the component definition.
   */
  readonly version: string;

  /**
   * Author or maintainer information.
   */
  readonly author?: string;

  /**
   * License information.
   */
  readonly license?: string;

  /**
   * Creation timestamp.
   */
  readonly createdAt: string;

  /**
   * Last update timestamp.
   */
  readonly updatedAt: string;
}
