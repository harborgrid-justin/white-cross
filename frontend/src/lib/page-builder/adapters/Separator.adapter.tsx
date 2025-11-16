/**
 * Separator Component Adapter
 *
 * Adapts the UI Separator component for use in the page builder
 */

'use client';

import { Separator } from '@/components/ui/separator';
import { createAdapter } from '../utils/createAdapter';
import { ComponentDefinition } from '../types/component.types';
import { AdapterConfig } from '../types/adapter.types';

/**
 * Separator component definition for page builder
 */
export const SeparatorDefinition: ComponentDefinition = {
  id: 'ui-separator',
  name: 'Separator',
  displayName: 'Separator',
  description: 'Visual divider between content sections',
  category: 'layout',
  icon: 'Minus',
  tags: ['separator', 'divider', 'line', 'hr', 'layout'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Separator',

  acceptsChildren: false,

  props: [
    {
      name: 'orientation',
      label: 'Orientation',
      description: 'Separator orientation',
      type: 'string',
      controlType: 'select',
      defaultValue: 'horizontal',
      options: [
        { value: 'horizontal', label: 'Horizontal', icon: 'Minus' },
        { value: 'vertical', label: 'Vertical', icon: 'SeparatorVertical' },
      ],
      group: 'layout',
    },
    {
      name: 'decorative',
      label: 'Decorative',
      description: 'Whether the separator is purely decorative (not semantic)',
      type: 'boolean',
      controlType: 'boolean',
      defaultValue: true,
      group: 'accessibility',
    },
  ],

  defaultProps: {
    orientation: 'horizontal',
    decorative: true,
  },

  styleOptions: {
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'separator',
    keyboardNavigable: false,
  },

  previewProps: {
    orientation: 'horizontal',
    decorative: true,
  },
};

/**
 * Adapter configuration for Separator
 */
const separatorAdapterConfig: Partial<AdapterConfig<any, any>> = {
  transformProps: (props) => {
    return {
      orientation: props.orientation,
      decorative: props.decorative,
    };
  },
  defaults: {
    orientation: 'horizontal',
    decorative: true,
  },
};

/**
 * Separator adapter
 */
export const SeparatorAdapter = createAdapter(
  Separator,
  SeparatorDefinition,
  separatorAdapterConfig
);
