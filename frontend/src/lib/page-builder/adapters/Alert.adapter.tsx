/**
 * Alert Component Adapter
 *
 * Adapts the UI Alert compound component for use in the page builder
 */

'use client';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { createAdapter } from '../utils/createAdapter';
import { ComponentDefinition } from '../types/component.types';
import { AdapterConfig } from '../types/adapter.types';

/**
 * Alert root component definition
 */
export const AlertDefinition: ComponentDefinition = {
  id: 'ui-alert',
  name: 'Alert',
  displayName: 'Alert',
  description: 'Feedback component for displaying important messages to users',
  category: 'data-display',
  icon: 'AlertCircle',
  tags: ['alert', 'notification', 'message', 'feedback', 'banner'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Alert',

  acceptsChildren: true,
  minChildren: 0,
  childrenTypes: ['ui-alert-title', 'ui-alert-description'],

  props: [
    {
      name: 'variant',
      label: 'Variant',
      description: 'Alert visual style variant',
      type: 'string',
      controlType: 'select',
      defaultValue: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'destructive', label: 'Destructive' },
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
          { value: 'destructive', label: 'Destructive' },
        ],
      },
    ],
    supportsResponsive: true,
    supportsCustomCSS: true,
  },

  accessibility: {
    role: 'alert',
    defaultAriaLabel: 'Alert',
    keyboardNavigable: false,
  },

  previewProps: {
    variant: 'default',
  },
};

/**
 * Alert Title component definition
 */
export const AlertTitleDefinition: ComponentDefinition = {
  id: 'ui-alert-title',
  name: 'AlertTitle',
  displayName: 'Alert Title',
  description: 'Title text for an alert',
  category: 'data-display',
  icon: 'Type',
  tags: ['alert', 'title', 'heading'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Alert/Title',

  acceptsChildren: true,
  minChildren: 0,
  maxChildren: 1,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {
    children: 'Alert Title',
  },
};

/**
 * Alert Description component definition
 */
export const AlertDescriptionDefinition: ComponentDefinition = {
  id: 'ui-alert-description',
  name: 'AlertDescription',
  displayName: 'Alert Description',
  description: 'Description text for an alert',
  category: 'data-display',
  icon: 'AlignLeft',
  tags: ['alert', 'description', 'text', 'message'],

  renderMode: 'server',
  componentPath: '@/lib/page-builder/adapters/Alert/Description',

  acceptsChildren: true,
  minChildren: 0,

  props: [],

  accessibility: {
    keyboardNavigable: false,
  },

  previewProps: {
    children: 'Alert description text',
  },
};

/**
 * Adapter configuration for Alert
 */
const alertAdapterConfig: Partial<AdapterConfig<any, any>> = {
  transformProps: (props) => {
    return {
      variant: props.variant,
    };
  },
  defaults: {
    variant: 'default',
  },
};

/**
 * Simple adapter configuration for Alert sub-components
 */
const simpleAdapterConfig: Partial<AdapterConfig<any, any>> = {
  transformProps: (props) => props,
  defaults: {},
};

/**
 * Alert adapters
 */
export const AlertAdapter = createAdapter(Alert, AlertDefinition, alertAdapterConfig);
export const AlertTitleAdapter = createAdapter(AlertTitle, AlertTitleDefinition, simpleAdapterConfig);
export const AlertDescriptionAdapter = createAdapter(
  AlertDescription,
  AlertDescriptionDefinition,
  simpleAdapterConfig
);

/**
 * All Alert component definitions
 */
export const AlertDefinitions = [AlertDefinition, AlertTitleDefinition, AlertDescriptionDefinition];
