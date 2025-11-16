/**
 * Badge Component Adapter
 *
 * Adapts the UI Badge component for use in the page builder
 */

'use client';

import { Badge, BadgeProps } from '@/components/ui/badge';
import { createAdapter } from '../utils/createAdapter';
import { ComponentDefinition } from '../types/component.types';
import { AdapterConfig } from '../types/adapter.types';

/**
 * Badge component definition for page builder
 */
export const BadgeDefinition: ComponentDefinition = {
  id: 'ui-badge',
  name: 'Badge',
  displayName: 'Badge',
  description: 'Small status indicator or label component',
  category: 'data-display',
  icon: 'Tag',
  tags: ['badge', 'label', 'status', 'indicator', 'tag'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Badge',

  acceptsChildren: true,
  minChildren: 0,
  maxChildren: 1,

  props: [
    {
      name: 'variant',
      label: 'Variant',
      description: 'Badge visual style variant',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'destructive', label: 'Destructive' },
        { value: 'outline', label: 'Outline' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' },
        { value: 'info', label: 'Info' },
      ],
      group: 'appearance',
    },
  ],

  defaultProps: {
    variant: 'default',
  },

  styleOptions: {
    variants: [
      {
        name: 'variant',
        label: 'Style Variant',
        values: [
          { value: 'default', label: 'Default' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'destructive', label: 'Destructive' },
          { value: 'outline', label: 'Outline' },
          { value: 'success', label: 'Success' },
          { value: 'warning', label: 'Warning' },
          { value: 'error', label: 'Error' },
          { value: 'info', label: 'Info' },
        ],
      },
    ],
    supportsResponsive: false,
    supportsCustomCSS: true,
  },

  accessibility: {
    defaultAriaLabel: 'Badge',
    keyboardNavigable: false,
  },

  previewProps: {
    variant: 'default',
    children: 'Badge',
  },
};

/**
 * Adapter configuration for Badge
 */
const badgeAdapterConfig: Partial<AdapterConfig<BadgeProps, any>> = {
  transformProps: (props) => {
    return {
      variant: props.variant,
    } as BadgeProps;
  },

  defaults: {
    variant: 'default',
  },
};

/**
 * Badge adapter
 */
export const BadgeAdapter = createAdapter<BadgeProps, any>(
  Badge,
  BadgeDefinition,
  badgeAdapterConfig
);
