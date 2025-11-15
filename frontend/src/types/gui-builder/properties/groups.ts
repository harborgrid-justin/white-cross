/**
 * Property Grouping Types
 *
 * This module defines types for organizing properties into logical groups
 * for better UI organization and user experience.
 *
 * @module gui-builder/properties/groups
 */

import type { PropertyId } from '../core';
import type { PropertyCondition } from './schema';

/**
 * Predefined property group identifiers.
 */
export enum PropertyGroupId {
  /**
   * General/basic properties.
   */
  General = 'general',

  /**
   * Layout and positioning properties.
   */
  Layout = 'layout',

  /**
   * Styling properties (colors, fonts, etc.).
   */
  Styling = 'styling',

  /**
   * Content properties (text, images, etc.).
   */
  Content = 'content',

  /**
   * Behavior properties (interactions, events).
   */
  Behavior = 'behavior',

  /**
   * Data binding properties.
   */
  DataBinding = 'data-binding',

  /**
   * Advanced properties.
   */
  Advanced = 'advanced',

  /**
   * Responsive design properties.
   */
  Responsive = 'responsive',

  /**
   * Accessibility properties.
   */
  Accessibility = 'accessibility',

  /**
   * SEO properties.
   */
  SEO = 'seo',

  /**
   * Animation properties.
   */
  Animation = 'animation',

  /**
   * Form properties (validation, submission).
   */
  Form = 'form',

  /**
   * Custom group.
   */
  Custom = 'custom',
}

/**
 * Property group layout mode.
 */
export enum PropertyGroupLayout {
  /**
   * Vertical stack (default).
   */
  Vertical = 'vertical',

  /**
   * Horizontal row.
   */
  Horizontal = 'horizontal',

  /**
   * Grid layout.
   */
  Grid = 'grid',

  /**
   * Tabs.
   */
  Tabs = 'tabs',

  /**
   * Accordion.
   */
  Accordion = 'accordion',
}

/**
 * Property group theme/style.
 */
export interface PropertyGroupTheme {
  /**
   * Background color.
   */
  readonly backgroundColor?: string;

  /**
   * Border style.
   */
  readonly border?: string;

  /**
   * Padding.
   */
  readonly padding?: string;

  /**
   * Custom CSS classes.
   */
  readonly className?: string;
}

/**
 * Property group definition.
 */
export interface PropertyGroup {
  /**
   * Unique identifier for the group.
   */
  readonly id: PropertyGroupId | string;

  /**
   * Display label.
   */
  readonly label: string;

  /**
   * Description of the group.
   */
  readonly description?: string;

  /**
   * Icon identifier.
   */
  readonly icon?: string;

  /**
   * Layout mode for properties in this group.
   */
  readonly layout?: PropertyGroupLayout;

  /**
   * Whether the group is collapsible.
   */
  readonly collapsible?: boolean;

  /**
   * Whether the group is initially collapsed.
   */
  readonly defaultCollapsed?: boolean;

  /**
   * Display order (lower = earlier).
   */
  readonly order?: number;

  /**
   * Properties in this group.
   */
  readonly properties: readonly PropertyId[];

  /**
   * Nested subgroups.
   */
  readonly subgroups?: readonly PropertyGroup[];

  /**
   * Conditional visibility.
   */
  readonly condition?: PropertyCondition;

  /**
   * Whether this group is read-only.
   */
  readonly readOnly?: boolean;

  /**
   * Custom theme for the group.
   */
  readonly theme?: PropertyGroupTheme;

  /**
   * Help text or documentation link.
   */
  readonly helpText?: string;

  /**
   * External documentation URL.
   */
  readonly documentationUrl?: string;

  /**
   * Custom metadata.
   */
  readonly metadata?: Record<string, unknown>;
}

/**
 * Property group collection.
 */
export type PropertyGroupCollection = readonly PropertyGroup[];

/**
 * Flat list of all properties across all groups.
 */
export type FlatPropertyList = readonly {
  readonly propertyId: PropertyId;
  readonly groupId: string;
  readonly groupLabel: string;
  readonly order: number;
}[];

/**
 * Helper to create a property group.
 */
export function createPropertyGroup(
  id: PropertyGroupId | string,
  label: string,
  properties: readonly PropertyId[],
  options?: Partial<Omit<PropertyGroup, 'id' | 'label' | 'properties'>>,
): PropertyGroup {
  return {
    id,
    label,
    properties,
    ...options,
  };
}

/**
 * Helper to flatten property groups into a list.
 */
export function flattenPropertyGroups(
  groups: PropertyGroupCollection,
): FlatPropertyList {
  const result: Array<{
    propertyId: PropertyId;
    groupId: string;
    groupLabel: string;
    order: number;
  }> = [];

  groups.forEach((group, groupIndex) => {
    group.properties.forEach((propertyId, propIndex) => {
      result.push({
        propertyId,
        groupId: group.id,
        groupLabel: group.label,
        order: (group.order ?? groupIndex) * 1000 + propIndex,
      });
    });

    // Handle subgroups recursively
    if (group.subgroups) {
      const subgroupFlat = flattenPropertyGroups(group.subgroups);
      result.push(...subgroupFlat);
    }
  });

  return result;
}

/**
 * Helper to find a property's group.
 */
export function findPropertyGroup(
  propertyId: PropertyId,
  groups: PropertyGroupCollection,
): PropertyGroup | undefined {
  for (const group of groups) {
    if (group.properties.includes(propertyId)) {
      return group;
    }
    if (group.subgroups) {
      const found = findPropertyGroup(propertyId, group.subgroups);
      if (found) return found;
    }
  }
  return undefined;
}
